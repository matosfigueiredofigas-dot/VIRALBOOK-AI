import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

const prompts = {
  gtm: (name: string, audience: string, problem: string, features: string) => `Você é um CMO experiente do Vale do Silício. Crie um Roadmap Go-To-Market de 30 dias focado em capturar os primeiros 10 clientes para o SaaS "${name}" que atende "${audience}" resolvendo o problema "${problem}".
Formato OBRIGATÓRIO de saída (JSON puro):
{
  "weeks": [
    { "week": 1, "focus": "Preparação e Canais Iniciais", "actions": ["Ação 1", "Ação 2", "Ação 3"] },
    { "week": 2, "focus": "Tração e Cold Outreach", "actions": ["Ação 1", "Ação 2"] },
    { "week": 3, "focus": "Comunidades e Conteúdo", "actions": ["Ação 1", "Ação 2"] },
    { "week": 4, "focus": "Fechamento e Onboarding", "actions": ["Ação 1", "Ação 2"] }
  ]
}`,
  
  tech: (name: string, features: string) => `Você é um CTO Expert. Recomende a Tech Stack moderna ideal para desenvolver rapidamente o MVP do SaaS "${name}" que possui estas funcionalidades: ${features}.
Formato OBRIGATÓRIO de saída (JSON puro):
{
  "frontend": { "name": "ex: Next.js", "reason": "Motivo" },
  "backend_db": { "name": "ex: Supabase", "reason": "Motivo" },
  "ai_tools": { "name": "ex: OpenAI / Groq", "reason": "Motivo" },
  "payments": { "name": "ex: Stripe", "reason": "Motivo" }
}`,

  competitor: (name: string, problem: string) => `Você é um Analista Competitivo. Liste 3 possíveis concorrentes reais ou indiretos para um SaaS focado em resolver: "${problem}".
Para cada concorrente, identifique a maior brecha/falha deles que o nosso SaaS "${name}" pode usar como vantagem competitiva.
Formato OBRIGATÓRIO de saída (JSON puro):
{
  "competitors": [
    { "name": "Nome do Concorrente", "weakness": "A maior fraqueza ou brecha deles", "our_advantage": "Como vamos superá-los" }
  ]
}`,

  pitch: (name: string, problem: string, audience: string, features: string) => `Você é um Fundador Serial levantando Seed Round. Escreva o conteúdo de um Pitch Deck para o SaaS "${name}".
Problema: ${problem}
Público: ${audience}
Solução: ${features}
Formato OBRIGATÓRIO de saída (JSON puro):
{
  "slides": [
    { "title": "O Problema", "content": "Descrição em tópicos do problema" },
    { "title": "Nossa Solução", "content": "Como resolvemos" },
    { "title": "Tamanho do Mercado", "content": "Estimativa (TAM/SAM/SOM)" },
    { "title": "Por que Agora?", "content": "Momento de mercado" },
    { "title": "Modelo de Negócios", "content": "Como cobramos" }
  ]
}`,

  sql: (name: string, features: string) => `Você é um Arquiteto de Banco de Dados Postgres (Supabase). Crie as queries SQL exatas para criar as tabelas iniciais necessárias para o MVP do SaaS "${name}" com as seguintes features: ${features}.
Inclua RLS policies básicas se necessário. Use uuid como chave primária padrão.
Formato OBRIGATÓRIO de saída (JSON puro):
{
  "sql_code": "CREATE TABLE users (\\n id UUID... \\n); \\n\\n CREATE TABLE..."
}`
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const { opportunityId, moduleType, saasName, problem, audience, features } = await req.json();

    if (!opportunityId || !moduleType || !prompts[moduleType as keyof typeof prompts]) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    // Verifica se a oportunidade pertence ao usuário
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .select('id')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (oppError || !opp) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    const promptGenerator = prompts[moduleType as keyof typeof prompts];
    const prompt = promptGenerator(saasName || '', problem || '', audience || '', features || '');

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
    let resultData;
    
    try {
      resultData = JSON.parse(responseContent);
    } catch (e) {
      return NextResponse.json({ error: 'Erro ao parsear JSON da IA' }, { status: 500 });
    }

    const columnMap: Record<string, string> = {
      'gtm': 'gtm_roadmap',
      'tech': 'tech_stack',
      'competitor': 'competitor_analysis',
      'pitch': 'pitch_deck',
      'sql': 'sql_schema'
    };

    const targetColumn = columnMap[moduleType];
    const updateData: any = {};
    updateData[targetColumn] = moduleType === 'sql' ? resultData.sql_code : resultData;

    const { error: updateError } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', opportunityId);

    if (updateError) {
      throw new Error(`Erro ao salvar no banco: ${updateError.message}`);
    }

    return NextResponse.json({ data: updateData[targetColumn] });
  } catch (error: any) {
    console.error(`[Premium Modules - ${req.url}] Error:`, error);
    return NextResponse.json({ error: error.message || 'Erro ao processar' }, { status: 500 });
  }
}
