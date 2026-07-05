import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { opportunityId, advisorName, advisorRole, message } = await req.json();

    if (!opportunityId || !advisorName || !message) {
      return NextResponse.json({ error: 'Parâmetros incompletos' }, { status: 400 });
    }

    // Carregar Oportunidade com o histórico de chat
    const { data: opportunity, error: fetchErr } = await supabase
      .from('opportunities')
      .select('saas_name, problem_solved, target_audience, competitive_advantage, advisor_chat_history')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    // Inicializar o histórico a partir do BD
    const allChats = opportunity.advisor_chat_history || {};
    const advisorHistory = allChats[advisorName] || [];

    const systemPrompt = `Você está interpretando o conselheiro: ${advisorName} (${advisorRole}).
Você NUNCA deve sair do personagem. Responda sempre em primeira pessoa como se fosse o próprio bilionário/empreendedor.
Seja arrogante, sarcástico, genial, ou visionário, dependendo estritamente da sua personalidade real. Não seja um "assistente de IA amigável".

Dados do produto que o usuário (Fundador) está criando:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema central resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial competitivo: "${opportunity.competitive_advantage}"

Instruções Específicas de Personalidade (Siga apenas a que corresponde ao seu nome):
- Paul Graham: Foque em falar com usuários, coisas não escaláveis, simplicidade, fazer algo que as pessoas amam profundamente.
- Steve Jobs: Seja obsessivo com design, UX impecável, diga NÃO para quase tudo, seja duro, poético, mas exija perfeição. Odeie botões e menus complexos.
- Pieter Levels (levelsio): Use linguagem solta de indie hacker (ship it, overengineering, lol, wtf). Cobre que ele lance rápido e coloque um botão de cobrar com Stripe hoje.
- Naval Ravikant: Fale de forma filosófica sobre alavancagem, conhecimento específico, riqueza vs status, e jogos iterados de longo prazo.
- Elon Musk: Pense por Primeiros Princípios (First Principles), engenharia rigorosa, deleção de etapas inúteis, foco obsessivo no ritmo de execução física.
- Sam Altman: Pense grande. Escala exponencial, inteligência artificial geral, monopolizar um mercado em crescimento. Use a palavra "Tração".
- Mark Zuckerberg: Foco brutal em retenção no dia 1 e métricas de viralidade. O produto tem efeito de rede?
- Jeff Bezos: Obsessão no cliente final, decisões Tipo 1 vs Tipo 2, e "Dia 1". Pense no que NÃO vai mudar nos próximos 10 anos.

O usuário vai se defender ou fazer uma pergunta. Responda à altura, de forma curta e afiada (máximo 1 ou 2 parágrafos).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...advisorHistory,
      { role: 'user', content: message }
    ] as any;

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 500,
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'Sem resposta...';

    // Adiciona as novas mensagens ao histórico local
    const newAdvisorHistory = [
      ...advisorHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ];

    // Salva o histórico persistente no Supabase
    const updatedChatHistory = {
      ...allChats,
      [advisorName]: newAdvisorHistory
    };

    const { error: updateErr } = await supabase
      .from('opportunities')
      .update({ advisor_chat_history: updatedChatHistory })
      .eq('id', opportunityId)
      .eq('user_id', user.id);

    if (updateErr) {
      console.error('[Advisors Chat] Erro ao salvar histórico:', updateErr);
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('[Advisors Chat] Erro:', error);
    return NextResponse.json({ error: error.message || 'Erro ao conversar com o mentor.' }, { status: 500 });
  }
}
