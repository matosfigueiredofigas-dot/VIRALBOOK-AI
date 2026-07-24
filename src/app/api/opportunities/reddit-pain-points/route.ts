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

    const { opportunityId, language = 'pt' } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese';

    // 1. Carregar Oportunidade
    const { data: opportunity, error: fetchErr } = await supabase
      .from('opportunities')
      .select('id, saas_name, target_audience, problem_solved, reddit_pain_points, user_id')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    if (opportunity.user_id && opportunity.user_id !== user.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Se já foi analisado e possui dores no cache, retorna direto
    if (opportunity.reddit_pain_points && Array.isArray(opportunity.reddit_pain_points) && opportunity.reddit_pain_points.length > 0) {
      return NextResponse.json({ success: true, painPoints: opportunity.reddit_pain_points, cached: true });
    }

    // 2. Buscar discussões reais no Reddit
    const keyword = opportunity.target_audience || opportunity.saas_name;
    console.log(`[Reddit Extractor] Buscando Reddit para: "${keyword}"`);

    let posts: any[] = [];
    try {
      const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=relevance&limit=15`);
      if (res.ok) {
        const json = await res.json();
        posts = json.data?.children || [];
      }
    } catch (err) {
      console.warn('[Reddit Extractor] Falha ao fazer fetch no Reddit API, usando fallback...', err);
    }

    if (posts.length === 0) {
      try {
        const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(opportunity.saas_name)}&sort=new&limit=10`);
        if (res.ok) {
          const json = await res.json();
          posts = json.data?.children || [];
        }
      } catch (err) {
        console.warn('[Reddit Extractor] Falha na segunda busca do Reddit:', err);
      }
    }

    const redditPostsContext = posts.map((p: any) => ({
      title: p.data?.title || 'Discussão do usuário',
      text: p.data?.selftext ? p.data.selftext.slice(0, 300) : 'Sem descrição.',
      url: p.data?.permalink ? `https://www.reddit.com${p.data.permalink}` : 'https://www.reddit.com'
    }));

    // 3. Chamar IA do Groq para extrair dores
    const systemPrompt = `Você é um Analista de Mercado e Especialista em Pesquisa de Dores do Usuário (Customer Pain Points).
Sua missão é analisar discussões extraídas de subreddits e fóruns do Reddit relacionados ao seguinte nicho de mercado e extrair as dores no idioma: ${targetLang}.

INFORMAÇÕES DO SAAS:
- Nome sugerido do SaaS: "${opportunity.saas_name}"
- Problema central resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"

Abaixo estão as postagens reais encontradas sobre este assunto no Reddit:
${JSON.stringify(redditPostsContext, null, 2)}

Selecione e classifique as 3 maiores DORES, RECLAMAÇÕES ou NECESSIDADES REAIS dos usuários nas discussões que mostram uma oportunidade de negócios. Se as discussões acima forem vazias ou insuficientes, você deve usar seus conhecimentos sobre as dores de "${opportunity.target_audience}" combinadas com o problema central do SaaS para idealizar dores realistas do Reddit.

Você DEVE responder ESTRITAMENTE em formato JSON com uma chave raiz "pain_points":
{
  "pain_points": [
    {
      "pain_point": "Definição curta da dor no idioma ${targetLang}",
      "severity": 5,
      "quotes": [
        "Uma reclamação/desabafo realista que um usuário faria sobre essa dor no Reddit, no idioma ${targetLang}",
        "Outro desabafo ou comentário realista sobre o mesmo problema no idioma ${targetLang}"
      ],
      "source_title": "O título da postagem no Reddit que originou essa análise",
      "source_url": "A URL exata do post original (da lista fornecida) ou uma URL válida do Reddit baseada na palavra-chave"
    }
  ]
}

IMPORTANTE: Responda APENAS o JSON válido em ${targetLang}. Não adicione nenhuma introdução ou texto fora do JSON.`;

    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Reddit Extractor] Analisando com modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: systemPrompt }],
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        reply = chatCompletion.choices[0]?.message?.content || '';
        if (reply) {
          console.log(`[Reddit Extractor] Análise gerada com sucesso usando: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Reddit Extractor] Falha com ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw new Error(`Falha crítica na análise do Groq: ${lastError?.message || lastError}`);
    }

    const parsedData = JSON.parse(reply);
    const painPointsArray = parsedData.pain_points || (Array.isArray(parsedData) ? parsedData : parsedData.dores || []);

    // 4. Atualizar no banco de dados na coluna da oportunidade
    const { error: updateErr } = await supabase
      .from('opportunities')
      .update({ reddit_pain_points: painPointsArray })
      .eq('id', opportunityId);

    if (updateErr) {
      throw new Error(`Erro ao atualizar no banco: ${updateErr.message}`);
    }

    return NextResponse.json({ success: true, painPoints: painPointsArray, cached: false });

  } catch (error: any) {
    console.error('Erro na extração de dores do Reddit:', error);
    return NextResponse.json({ error: error.message || 'Erro ao mapear dores.' }, { status: 500 });
  }
}
