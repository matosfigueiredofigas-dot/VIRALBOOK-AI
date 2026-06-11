import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runOpenAIFallback(systemPrompt: string, userPrompt: string): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave OPENAI_API_KEY não configurada para failover.");
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
  // Lista de modelos: 1º mais barato, 2º mais robusto, 3º contingência extrema (Mixtral)
  const models = ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[Groq Agent] Tentando executar com o modelo: ${model}`);
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: model,
        response_format: { type: "json_object" },
        temperature: 0.3, // Menor temperatura garante maior precisão no formato JSON
      });
      
      const content = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      console.log(`[Groq Agent] Sucesso total usando: ${model}`);
      return parsed;
    } catch (error: any) {
      console.warn(`[Groq Agent] Falha ou erro de JSON com ${model}. Tentando contingência... Erro:`, error.message || error);
      lastError = error;
    }
  }

  // Tenta failover para a OpenAI caso a chave esteja configurada
  if (process.env.OPENAI_API_KEY) {
    try {
      return await runOpenAIFallback(systemPrompt, userPrompt);
    } catch (openAiError: any) {
      console.error("[Groq Agent] Falha também no failover da OpenAI:", openAiError.message || openAiError);
      lastError = openAiError;
    }
  }

  throw new Error(`Falha crítica: Todos os agentes da IA falharam. Último erro: ${lastError?.message || lastError}`);
}

export class GroqService {
  /**
   * Pipeline Multi-Agente para descobrir e projetar SaaS
   */
  static async generateOpportunity(book: any, trendsData: any, redditData: any, facebookData: any, country: string, targetAudience?: string) {
    try {
      // ---------------------------------------------------------
      // AGENTE 1: O ANALISTA DE NEGÓCIOS & CONCORRÊNCIA
      // Objetivo: Entender a dor, avaliar concorrência e achar o diferencial.
      // ---------------------------------------------------------
      const systemAnalyst = `You are a brilliant Business Analyst. Return a valid JSON.
Output language MUST be in the native language of ${country}.
Your primary goal is to analyze the Target Audience and identify the single most critical, urgent, and monetizable pain point (core_problem) they face in their daily workflow or operations, and why existing solutions fail them.
Use the provided book metadata, Google Trends data, Reddit pain points, and Facebook signals as market inputs and context, but rely on your own deep expertise to define a realistic, cohesive, and highly specific problem for this audience.
Do NOT pair unrelated concepts; the pain point MUST make complete sense for this specific target audience.
Define 2-3 potential competitors in the market for this audience's pain point.
Based on the competitors, define a Unique Competitive Advantage (differentiation angle).
JSON Schema: { "core_problem": "string", "target_audience": "string", "competitors": "string", "competitive_advantage": "string" }`;

      const userAnalyst = `Target Audience: ${targetAudience || 'Any match based on context'}
Book Context: ${book.title} (${book.categories?.join(', ')}). Description: ${book.description?.substring(0, 500)}
Trends Signal: ${trendsData.monthlyGrowth}% growth.
Reddit Signal: ${redditData.mentions} mentions.
Facebook Signal: ${facebookData.adsCount} active ads, ${facebookData.groupsCount} related groups (examples: ${facebookData.relevantGroups?.join(', ')}).`;
      
      const analystResult = await runAgent(systemAnalyst, userAnalyst);

      // ---------------------------------------------------------
      // AGENTE 2: O ARQUITETO TÉCNICO
      // Objetivo: Criar a solução SaaS e os prompts de código.
      // ---------------------------------------------------------
      const systemArchitect = `You are a brilliant SaaS Technical Architect. Return a valid JSON.
Output language MUST be in the native language of ${country}.
Based on the business analyst's findings, design a Micro-SaaS.
Provide a catchy SaaS Name, MVP Features (buildable in 30 days), Development Time estimation, Implementation Difficulty (Low/Medium/High).
Also write highly detailed, step-by-step technical prompts for an AI code generator like Lovable and Bolt.new to build the MVP.
JSON Schema: { "saas_name": "string", "mvp_features": "string", "development_time": "string", "implementation_difficulty": "string", "prompt_lovable": "string", "prompt_bolt": "string" }`;

      const userArchitect = `Problem: ${analystResult.core_problem}. Audience: ${targetAudience || analystResult.target_audience}. Advantage: ${analystResult.competitive_advantage}`;

      const architectResult = await runAgent(systemArchitect, userArchitect);

      // ---------------------------------------------------------
      // AGENTE 3: O DIRETOR DE GROWTH & MONETIZAÇÃO
      // Objetivo: Definir preço e estimativa de MRR.
      // ---------------------------------------------------------
      const systemGrowth = `You are a brilliant SaaS Growth Marketer. Return a valid JSON.
Output language MUST be in the native language of ${country}, EXCEPT for pricing and revenue values (suggested_price and potential_revenue), which MUST always be specified in USD ($) currency.
Based on the SaaS designed, define the monetization model, suggested price, and an AI confidence score for this opportunity.
JSON Schema: { "monetization_model": "string", "suggested_price": "string", "potential_revenue": "string", "aiOpportunityScore": number (0-100) }`;

      const userGrowth = `SaaS Name: ${architectResult.saas_name}. Audience: ${targetAudience || analystResult.target_audience}. Features: ${architectResult.mvp_features}`;

      const growthResult = await runAgent(systemGrowth, userGrowth);

      // Consolida e retorna o objeto inteiro
      return {
        saasName: architectResult.saas_name,
        problemSolved: analystResult.core_problem,
        targetAudience: targetAudience || analystResult.target_audience,
        competitiveAdvantage: `${analystResult.competitive_advantage} (Concorrentes Mapeados: ${analystResult.competitors})`,
        mvpFeatures: architectResult.mvp_features,
        monetizationModel: growthResult.monetization_model,
        suggestedPrice: growthResult.suggested_price,
        potentialRevenue: growthResult.potential_revenue,
        implementationDifficulty: architectResult.implementation_difficulty,
        developmentTime: architectResult.development_time,
        aiOpportunityScore: growthResult.aiOpportunityScore,
        promptLovable: architectResult.prompt_lovable,
        promptBolt: architectResult.prompt_bolt,
      };

    } catch (error) {
      console.error("Erro no Groq Multi-Agente:", error);
      return null;
    }
  }
}
