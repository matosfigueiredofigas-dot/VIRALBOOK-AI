import { Groq } from 'groq-sdk';
import { getSetting } from '@/lib/settings';

async function runGeminiFallback(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = (await getSetting('GEMINI_API_KEY')) || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave GEMINI_API_KEY não configurada.");
  }

  console.log("[Groq Agent] Acionando failover de contingência para o Gemini 2.0 Flash...");
  const prompt = `${systemPrompt}\n\nUser Request:\n${userPrompt}\n\nIMPORTANT: Respond strictly with a valid JSON object matching the requested schema without any markdown text surrounding it.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro na API do Gemini 2.0: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(content);
}

async function runOpenAIFallback(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = (await getSetting('OPENAI_API_KEY')) || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave OPENAI_API_KEY não configurada.");
  }

  console.log("[Groq Agent] Acionando failover de contingência para a OpenAI (gpt-4o-mini)...");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erro na API da OpenAI: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  const content = data.choices[0]?.message?.content || "{}";
  return JSON.parse(content);
}

async function runAgent(systemPrompt: string, userPrompt: string): Promise<any> {
  let lastError: any = null;

  // 1. Tentar Groq com a chave configurada
  const groqApiKey = (await getSetting('GROQ_API_KEY')) || process.env.GROQ_API_KEY;
  if (groqApiKey && groqApiKey !== 'placeholder_key') {
    const groq = new Groq({ apiKey: groqApiKey });
    const models = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];

    for (const model of models) {
      try {
        console.log(`[Groq Agent] Executando Groq com modelo: ${model}`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          model: model,
          response_format: { type: "json_object" },
          temperature: 0.3,
        });
        
        const content = completion.choices[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        console.log(`[Groq Agent] Sucesso total com Groq: ${model}`);
        return parsed;
      } catch (error: any) {
        console.warn(`[Groq Agent] Falha com modelo ${model}:`, error.message || error);
        lastError = error;
      }
    }
  }

  // 2. Failover: Gemini 2.0 Flash
  try {
    return await runGeminiFallback(systemPrompt, userPrompt);
  } catch (geminiError: any) {
    console.warn("[Groq Agent] Falha no failover do Gemini:", geminiError.message || geminiError);
    lastError = geminiError;
  }

  // 3. Failover: OpenAI
  try {
    return await runOpenAIFallback(systemPrompt, userPrompt);
  } catch (openAiError: any) {
    console.warn("[Groq Agent] Falha no failover da OpenAI:", openAiError.message || openAiError);
    lastError = openAiError;
  }

  throw new Error(`Falha crítica nos provedores de IA. Último erro: ${lastError?.message || lastError}`);
}

export class GroqService {
  static async generateOpportunity(book: any, trendsData: any, redditData: any, facebookData: any, country: string, ideaOrAudience?: any, targetLanguage: string = 'pt') {
    try {
      const isIdeaObject = ideaOrAudience && typeof ideaOrAudience === 'object';
      const targetAudience = isIdeaObject ? ideaOrAudience.audience : (typeof ideaOrAudience === 'string' ? ideaOrAudience : undefined);
      const targetProblem = isIdeaObject ? ideaOrAudience.problem : undefined;
      const targetTechnology = isIdeaObject ? ideaOrAudience.technology : undefined;
      const targetMonetization = isIdeaObject ? ideaOrAudience.monetization : undefined;

      const langMap: Record<string, string> = { en: 'English', es: 'Spanish', pt: 'Portuguese' };
      const languageName = langMap[targetLanguage] || 'Portuguese';

      // AGENTE 1: O ANALISTA DE NEGÓCIOS
      const systemAnalyst = `You are a brilliant Business Analyst. Return a valid JSON.
Output language MUST be in ${languageName}.
JSON Schema: { "core_problem": "string", "target_audience": "string", "competitors": "string", "competitive_advantage": "string" }`;

      const userAnalyst = `### Target Country\n${country}\n\n### Book Context\nTitle: ${book.title}\nDescription: ${book.description?.substring(0, 500) || 'N/A'}`;
      
      let analystResult: any;
      try {
        analystResult = await runAgent(systemAnalyst, userAnalyst);
      } catch (err) {
        console.warn("[GroqService] Erro no Agente 1, utilizando fallback de contingência.");
        analystResult = {
          core_problem: `Automação prática dos ensinamentos de ${book.title}`,
          target_audience: targetAudience || "Leitores e executivos focados em produtividade",
          competitors: "Planilhas manuais e formulários em papel",
          competitive_advantage: "Plataforma digital automatizada com alertas inteligentes"
        };
      }

      const coreProblem = targetProblem ? targetProblem : analystResult.core_problem;
      const finalTargetAudience = targetAudience ? targetAudience : analystResult.target_audience;

      // AGENTE 2: O ARQUITETO TÉCNICO
      const systemArchitect = `You are a brilliant SaaS Technical Architect. Return a valid JSON.
Output language MUST be in ${languageName}.
JSON Schema: { "saas_name": "string", "mvp_features": "string", "development_time": "string", "implementation_difficulty": "string", "prompt_lovable": "string", "prompt_bolt": "string" }`;

      const userArchitect = `### SaaS Concept\nProblem: ${coreProblem}\nAudience: ${finalTargetAudience}\nBook: ${book.title}`;

      let architectResult: any;
      try {
        architectResult = await runAgent(systemArchitect, userArchitect);
      } catch (err) {
        console.warn("[GroqService] Erro no Agente 2, utilizando fallback de contingência.");
        const cleanTitle = book.title.replace(/[^a-zA-Z0-9\s]/g, "").split(" ")[0];
        architectResult = {
          saas_name: `${cleanTitle}Flow AI`,
          mvp_features: `Dashboard de controlo diário, gerador de rotinas baseadas em ${book.title}, acompanhamento de metas em tempo real e notificações automáticas.`,
          development_time: "7 a 14 dias",
          implementation_difficulty: "Média",
          prompt_lovable: `Crie um SaaS de produtividade para automatizar o método do livro ${book.title}. Inclua dashboard com gráficos, acompanhamento de progresso e autenticação de utilizadores.`,
          prompt_bolt: `Construa uma aplicação Next.js e Tailwind CSS para gerir rotinas e processos inspirados em ${book.title}.`
        };
      }

      // AGENTE 3: O DIRETOR DE GROWTH
      const systemGrowth = `You are a SaaS Growth Marketer. Return a valid JSON.
JSON Schema: { "monetization_model": "string", "suggested_price": "string", "potential_revenue": "string", "aiOpportunityScore": number }`;

      const userGrowth = `### SaaS Details\nName: ${architectResult.saas_name}\nAudience: ${finalTargetAudience}`;

      let growthResult: any;
      try {
        growthResult = await runAgent(systemGrowth, userGrowth);
      } catch (err) {
        console.warn("[GroqService] Erro no Agente 3, utilizando fallback de contingência.");
        growthResult = {
          monetization_model: "Subscrição Mensal (SaaS)",
          suggested_price: "$19/mês",
          potential_revenue: "$4,500/mês",
          aiOpportunityScore: 85
        };
      }

      return {
        saasName: architectResult.saas_name || `${book.title} App`,
        problemSolved: coreProblem,
        targetAudience: finalTargetAudience,
        competitiveAdvantage: `${analystResult.competitive_advantage} (Concorrentes: ${analystResult.competitors})`,
        mvpFeatures: architectResult.mvp_features,
        monetizationModel: targetMonetization || growthResult.monetization_model,
        suggestedPrice: growthResult.suggested_price,
        potentialRevenue: growthResult.potential_revenue,
        implementationDifficulty: architectResult.implementation_difficulty || "Média",
        developmentTime: architectResult.development_time || "14 dias",
        aiOpportunityScore: growthResult.aiOpportunityScore || 82,
        promptLovable: architectResult.prompt_lovable,
        promptBolt: architectResult.prompt_bolt,
      };

    } catch (error) {
      console.error("Erro no Groq Multi-Agente:", error);
      return null;
    }
  }
}
