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
      .select('id, saas_name, target_audience, problem_solved, competitive_advantage, book_title, book_author, marketing_kit, user_id')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    if (opportunity.user_id && opportunity.user_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Se já foi gerado e possui cache, retorna direto
    if (opportunity.marketing_kit && typeof opportunity.marketing_kit === 'object' && Object.keys(opportunity.marketing_kit).length > 0) {
      return NextResponse.json({ success: true, marketingKit: opportunity.marketing_kit, cached: true });
    }

    // 2. Chamar IA do Groq para criar as copys de marketing
    const systemPrompt = `Você é um Copywriter especialista em lançamentos virais de produtos de tecnologia (SaaS/Micro-SaaS) e Growth Hacker experiente.
Sua missão é criar um Kit de Marketing & Lançamento de alta conversão para o seguinte SaaS:

DADOS DO SAAS:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema central resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial competitivo: "${opportunity.competitive_advantage}"
- Inspirado no livro: "${opportunity.book_title}" de "${opportunity.book_author || 'Desconhecido'}"

Você deve gerar e retornar estritamente um JSON com copys em português do Brasil no seguinte formato:
{
  "twitter_thread": [
    "Tweet 1: Um ganho/gancho provocativo conectando o conceito principal do livro com um problema comum (ex: 'O livro [Livro] ensina que... mas 90% das pessoas falham nisso porque... 🧵')",
    "Tweet 2: O desdobramento do problema de forma visual e dolorosa para o leitor",
    "Tweet 3: A revelação da solução - Apresentação do [Nome do SaaS] e como ele resolve o problema com 1 clique (foco na praticidade)",
    "Tweet 4: Chamada para ação clara com link de lista de espera (ex: 'Estamos liberando acesso beta para os primeiros. Entre na lista aqui: [link]')"
  ],
  "linkedin_post": "Uma publicação profissional e inspiradora para o LinkedIn. Deve ter uma estrutura limpa (espaços em branco, parágrafos curtos, tópicos com emojis). Comece com uma lição de negócios forte relacionada ao nicho, conte uma breve história sobre a dor do público-alvo, apresente o [Nome do SaaS] como a evolução técnica dessa dor e finalize chamando para comentar ou se inscrever no beta. Use hashtags relevantes no fim.",
  "tiktok_script": {
    "hook": "Frase de impacto inicial para segurar o usuário nos primeiros 3 segundos (ex: 'Se você faz X, pare tudo o que está fazendo e olha isso...')",
    "scenes": [
      {
        "visual": "Descrição da cena visual (ex: 'Mostra a tela do computador com planilhas confusas')",
        "voiceover": "Falas do narrador/criador (ex: 'Passar horas organizando isso manualmente é coisa do passado...')"
      },
      {
        "visual": "Descrição da cena visual (ex: 'Aparece a interface limpa e rápida do [Nome do SaaS]')",
        "voiceover": "Falas do narrador (ex: 'É por isso que criamos este sistema que faz tudo em segundos...')"
      },
      {
        "visual": "Descrição da cena (ex: 'Zoom no botão de obter acesso antecipado')",
        "voiceover": "Falas do narrador (ex: 'Se você quer parar de perder tempo com isso e testar de graça...')"
      }
    ],
    "cta": "Chamada para ação do vídeo (ex: 'Comenta QUERO ou clica no link da bio para entrar no beta!')"
  },
  "cold_email": "Assunto: Uma ideia simples para resolver o [Problema/Dor] na [Empresa/Nicho]\n\nOlá, [Nome],\n\nNotei que quem atua como [Público-Alvo] costuma perder muito tempo com [Problema]. Inspirados no livro [Livro], criamos o [Nome do SaaS] para fazer [Solução].\n\nNossos primeiros usuários relataram economia de X horas por semana.\n\nEstamos liberando vagas limitadas para o beta. Seria interessante para você testar sem custos?\n\nAbs,\n[Seu Nome]"
}

IMPORTANTE: Responda APENAS o JSON válido. Não adicione nenhuma saudação ou introdução.`;

    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Marketing Kit] Gerando com modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: systemPrompt }],
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        reply = chatCompletion.choices[0]?.message?.content || '';
        if (reply) {
          console.log(`[Marketing Kit] Kit de marketing gerado com sucesso usando: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Marketing Kit] Falha com ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw new Error(`Falha crítica na geração do Groq: ${lastError?.message || lastError}`);
    }

    const marketingKitData = JSON.parse(reply);

    // 4. Atualizar no banco de dados na coluna da oportunidade
    const { error: updateErr } = await supabase
      .from('opportunities')
      .update({ marketing_kit: marketingKitData })
      .eq('id', opportunityId);

    if (updateErr) {
      throw new Error(`Erro ao atualizar no banco: ${updateErr.message}`);
    }

    return NextResponse.json({ success: true, marketingKit: marketingKitData, cached: false });

  } catch (error: any) {
    console.error('Erro na geração do Kit de Marketing:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Kit de Marketing.' }, { status: 500 });
  }
}
