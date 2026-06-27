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

    const { opportunityId } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    // 1. Carregar Oportunidade
    const { data: opportunity, error: fetchErr } = await supabase
      .from('opportunities')
      .select('id, saas_name, target_audience, problem_solved, competitive_advantage, book_title, book_author, advisor_advice, user_id')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    if (opportunity.user_id && opportunity.user_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // 2. Chamar IA do Groq para simular o conselho de mentores
    const systemPrompt = `Você é o facilitador de um Conselho Consultivo de Startups (AI Board of Advisors) composto por 4 lendas do empreendedorismo tecnológico mundial.
Sua missão é gerar feedbacks profundos, sinceros, perspicazes e extremamente fiéis às filosofias de vida e negócios de cada um deles sobre o seguinte projeto de SaaS:

DADOS DO PROJETO:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema central resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial competitivo: "${opportunity.competitive_advantage}"
- Inspirado no livro: "${opportunity.book_title}" de "${opportunity.book_author || 'Desconhecido'}"

OS ADVISORS DO CONSELHO:
1. **Paul Graham (PG)**: Co-fundador da Y Combinator. Foca em: simplicidade extrema, validar falando com os usuários, fazer coisas que não escalam, evitar ideias complexas e criar produtos que as pessoas de fato amam desesperadamente.
2. **Steve Jobs**: Co-fundador da Apple. Foca em: obsessão com design e UX, dizer não a 99% dos recursos secundários, criar algo "insanamente incrível", simplicidade radical e controle rígido da qualidade do fluxo do usuário.
3. **Pieter Levels (levelsio)**: Fundador solo do PhotoAI/NomadList. Foca em: lançar em 24/48 horas (ship fast), criar código ultra simples (Javascript puro/sem frameworks complexos), cobrar dinheiro de verdade desde o dia 1, não planejar a escala antes do primeiro cliente e evitar qualquer burocracia ou overengineering.
4. **Naval Ravikant**: Fundador do AngelList. Foca em: construir alavancagem de código e mídia, focar em jogos de longo prazo, encontrar conhecimento específico insubstituível, construir relações assimétricas (baixo custo de fracasso, alto potencial de ganho) e encontrar o fit de produto e mercado definitivo.

Você deve gerar e retornar estritamente um JSON em português do Brasil contendo a pontuação e os feedbacks detalhados, estruturado no seguinte formato:
{
  "board_score": 85, // Uma pontuação média de 0 a 100 dada pelo conselho para a ideia.
  "verdict_summary": "Veredito geral consolidado do conselho (uma frase curta e impactante)",
  "advisors": [
    {
      "name": "Paul Graham",
      "avatar_style": "pg",
      "role": "Co-fundador da Y Combinator",
      "verdict": "Aprovado com Ressalvas / Promissor / Recomendo Pivô",
      "critical_review": "Uma crítica sincera, dura e perspicaz escrita no estilo ensaio clássico de Paul Graham. Deve apontar as fraquezas na hipótese de crescimento orgânico ou a complexidade inicial.",
      "actionable_advice": "Conselho prático e direto para o MVP (ex: 'Não tente escalar. Encontre os primeiros 10 usuários e resolva a dor manualmente...')"
    },
    {
      "name": "Steve Jobs",
      "avatar_style": "jobs",
      "role": "Co-fundador da Apple",
      "verdict": "Veredito de Jobs no seu estilo curto e decisivo",
      "critical_review": "Uma crítica focada na simplicidade do fluxo do produto. Escreva com paixão, mas cobrando perfeccionismo. Use palavras fortes e critique a falta de foco ou excesso de botões/funcionalidades do MVP.",
      "actionable_advice": "Conselho prático sobre simplificação de recursos (ex: 'Remova 90% das abas. Foque na única experiência essencial e torne-a mágica...')"
    },
    {
      "name": "Pieter Levels (levelsio)",
      "avatar_style": "levels",
      "role": "Criador do PhotoAI & NomadList",
      "verdict": "Ship it! / Lance Amanhã / Pense Mais Simples",
      "critical_review": "Uma crítica rápida, informal e direta, com gírias de criadores (como 'indie hacker', 'overengineering'). Vai reclamar de planejar demais, projetar bancos de dados complexos ou demorar para cobrar dos clientes.",
      "actionable_advice": "Conselho focado em rapidez de entrega e monetização rápida (ex: 'Coloque um botão de cobrar com Stripe ou PIX amanhã. Se ninguém comprar, desista rápido e faça outro...')"
    },
    {
      "name": "Naval Ravikant",
      "avatar_style": "naval",
      "role": "Investidor & Pensador",
      "verdict": "Alta Alavancagem / Jogo de Longo Prazo",
      "critical_review": "Uma avaliação filosófica profunda sobre a assimetria da ideia. Avaliar se o fundador está construindo valor de longo prazo ou apenas criando uma cópia descartável.",
      "actionable_advice": "Conselho focado em alavancagem pessoal e propriedade intelectual (ex: 'Construa conhecimento específico que não possa ser terceirizado. Deixe o código trabalhar para você...')"
    }
  ]
}

IMPORTANTE: Responda APENAS o JSON válido. Não adicione nenhuma saudação ou introdução.`;

    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Advisors] Gerando com modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: systemPrompt }],
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        reply = chatCompletion.choices[0]?.message?.content || '';
        if (reply) {
          console.log(`[Advisors] Conselho de mentores gerado com sucesso usando: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Advisors] Falha com ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw new Error(`Falha crítica na geração do Groq: ${lastError?.message || lastError}`);
    }

    const advisorAdviceData = JSON.parse(reply);

    // 4. Atualizar no banco de dados na coluna da oportunidade
    const { error: updateErr } = await supabase
      .from('opportunities')
      .update({ advisor_advice: advisorAdviceData })
      .eq('id', opportunityId);

    if (updateErr) {
      throw new Error(`Erro ao atualizar no banco: ${updateErr.message}`);
    }

    return NextResponse.json({ success: true, advisorAdvice: advisorAdviceData, cached: false });

  } catch (error: any) {
    console.error('Erro na geração do conselho de mentores:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar conselho de mentores.' }, { status: 500 });
  }
}
