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

    const { opportunityId, tone = 'persuasivo', discount = '20%' } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    // 1. Carregar Oportunidade
    const { data: opportunity, error: fetchErr } = await supabase
      .from('opportunities')
      .select('id, saas_name, target_audience, problem_solved, competitive_advantage, book_title, book_author, email_funnel, user_id')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    if (opportunity.user_id && opportunity.user_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // 2. Chamar IA do Groq para criar a sequência de e-mails
    const systemPrompt = `Você é um Copywriter especialista em Email Marketing de Alta Conversão para startups de tecnologia (SaaS/Micro-SaaS).
Sua missão é criar uma sequência lógica de 5 e-mails automáticos de nutrição e lançamento para a lista de espera (waitlist) do seguinte SaaS:

DADOS DO SAAS:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema central resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial competitivo: "${opportunity.competitive_advantage}"
- Inspirado no livro: "${opportunity.book_title}" de "${opportunity.book_author || 'Desconhecido'}"

CONFIGURAÇÕES ADICIONAIS:
- Tom de Voz: "${tone}" (ex: persuasivo, amigável, técnico, audacioso)
- Cupom/Desconto de Fundador: "${discount}"

Você deve gerar e retornar estritamente um JSON em português do Brasil com a sequência exata de 5 e-mails, estruturada no seguinte formato:
{
  "sequence": [
    {
      "day": "Dia 1 (Imediato)",
      "purpose": "Boas-vindas & Confirmação de vaga na Waitlist",
      "subject": "Assunto instigante do e-mail de boas-vindas",
      "preheader": "Pré-cabeçalho resumido e magnético",
      "body": "Corpo do e-mail com parágrafos bem espaçados, contendo uma mensagem calorosa de boas-vindas, explicando a proposta de valor do SaaS e garantindo que o usuário está no lugar certo."
    },
    {
      "day": "Dia 3",
      "purpose": "Storytelling & Agitação da Dor do público-alvo",
      "subject": "Assunto focado no maior problema do nicho",
      "preheader": "Frase de impacto sobre o problema",
      "body": "Corpo do e-mail contando uma breve narrativa realista sobre as frustrações comuns do público-alvo com o problema. Deve fazer referência ao livro [Livro] e agitar a dor de forma inteligente, preparando o terreno para a solução."
    },
    {
      "day": "Dia 5",
      "purpose": "Apresentação da Solução (O SaaS) & Demonstração",
      "subject": "Assunto revelando a solução inovadora",
      "preheader": "Como resolver isso em minutos...",
      "body": "Corpo do e-mail apresentando oficialmente o [Nome do SaaS] como a melhor solução baseada nos ensinamentos do livro. Explique as principais funcionalidades de forma prática (em tópicos) e como isso muda a vida do usuário."
    },
    {
      "day": "Dia 7",
      "purpose": "Oferta de Membro Fundador (Urgência & Escassez)",
      "subject": "Assunto com a oferta de desconto de fundador",
      "preheader": "Apenas para os primeiros da lista...",
      "body": "Corpo do e-mail oferecendo um convite exclusivo com um desconto de [Desconto] na assinatura anual ou mensal do [Nome do SaaS] por tempo limitado. Explique que os membros fundadores nos ajudam a moldar o produto e têm benefícios permanentes."
    },
    {
      "day": "Dia 9",
      "purpose": "Lançamento Oficial (Última Chamada)",
      "subject": "Assunto anunciando a abertura oficial das vagas",
      "preheader": "Seu acesso antecipado foi liberado!",
      "body": "Corpo do e-mail final anunciando que o produto está oficialmente no ar e as vagas para os planos com preço especial de fundador estão se encerrando em 24 horas. Chame para a ação com urgência."
    }
  ]
}

[ANTI-GENERIC SHIELD - INSTRUÇÕES DE PERSONA E NEGATIVE PROMPTING]
Aja como um Copywriter mestre em lançamentos e Direct Response. Você odeia jargões corporativos. Escreva de forma conversacional, como se estivesse mandando um e-mail para um amigo, mas de forma extremamente persuasiva. O assunto deve ser todo em letras minúsculas.
É ESTRITAMENTE PROIBIDO usar as seguintes palavras: revolucionário, inovador, otimizar, potencializar, plataforma, jornada, descobrir, sinergia. 
Não crie públicos genéricos. Especifique quem exatamente está recebendo a dor.

IMPORTANTE: Responda APENAS o JSON válido. Não adicione nenhuma saudação ou introdução.`;

    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Email Funnel] Gerando com modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: systemPrompt }],
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        reply = chatCompletion.choices[0]?.message?.content || '';
        if (reply) {
          console.log(`[Email Funnel] Funil gerado com sucesso usando: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Email Funnel] Falha com ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw new Error(`Falha crítica na geração do Groq: ${lastError?.message || lastError}`);
    }

    const emailFunnelData = JSON.parse(reply);

    // 4. Atualizar no banco de dados na coluna da oportunidade
    const { error: updateErr } = await supabase
      .from('opportunities')
      .update({ email_funnel: emailFunnelData })
      .eq('id', opportunityId);

    if (updateErr) {
      throw new Error(`Erro ao atualizar no banco: ${updateErr.message}`);
    }

    return NextResponse.json({ success: true, emailFunnel: emailFunnelData, cached: false });

  } catch (error: any) {
    console.error('Erro na geração do Funil de E-mail:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Funil de E-mail.' }, { status: 500 });
  }
}
