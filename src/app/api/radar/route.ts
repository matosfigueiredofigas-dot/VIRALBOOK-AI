import { NextResponse } from 'next/server';
import { GoogleBooksService } from '@/services/GoogleBooksService';
import { TrendsService } from '@/services/TrendsService';
import { RedditService } from '@/services/RedditService';
import { FacebookService } from '@/services/FacebookService';
import { GroqService } from '@/services/GroqService';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient, checkAdmin } from '@/utils/supabase/admin';

// Lógica de cálculo do Viral Opportunity Score (0-100)
// 25% Trends, 20% Reddit, 20% Facebook (Ads + Groups), 20% Livro, 15% IA
function calculateViralScore(
  trendsGrowth: number, 
  redditMentions: number, 
  facebookAds: number, 
  facebookGroups: number, 
  aiScore: number = 70,
  weights: { trends: number, reddit: number, facebook: number, book: number, ai: number } = { trends: 25, reddit: 20, facebook: 20, book: 20, ai: 15 }
) {
  const trendsWeight = Math.min((trendsGrowth / 100) * weights.trends, weights.trends); 
  const redditWeight = Math.min((redditMentions / 50) * weights.reddit, weights.reddit); 
  const facebookWeight = Math.min(((facebookAds * 3 + facebookGroups) / 30) * weights.facebook, weights.facebook); 
  const bookWeight = weights.book; 
  const aiWeight = (aiScore / 100) * weights.ai;
  
  return Math.round(trendsWeight + redditWeight + facebookWeight + bookWeight + aiWeight);
}

export async function POST(request: Request) {
  try {
    // 0. Proteger Rota: Apenas usuários logados podem acionar o radar para evitar consumo malicioso de créditos
    const authSupabase = await createClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado. Faça login para usar o radar.' }, { status: 401 });
    }

    // 0.2 Limitador de Créditos: Máximo de 10 pesquisas por usuário a cada 24 horas (ignorado em desenvolvimento)
    if (process.env.NODE_ENV !== 'development') {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: searchCount, error: countError } = await authSupabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', oneDayAgo);

      if (countError) {
        console.error("[Radar] Erro ao checar rate limit:", countError);
      } else if (searchCount !== null && searchCount >= 10) {
        console.log(`[Radar] Rate limit atingido pelo usuário: ${user.id} (${searchCount} buscas nas últimas 24h)`);
        return NextResponse.json(
          { error: 'Limite diário atingido. Você realizou 10 pesquisas nas últimas 24 horas. Para liberar mais pesquisas, faça upgrade da sua conta.' }, 
          { status: 429 }
        );
      }
    }

    const { keyword, country = 'ALL', idea, tier } = await request.json();

    // 0.5 Cache: Se já buscamos esse livro/termo nos últimos 7 dias, retorna do cache (apenas para pesquisas gerais sem ideia estruturada e sem tier específico)
    if (!idea && tier === undefined) {
      console.log("[Radar] Checando cache para:", keyword);
      const { data: cachedOpp } = await authSupabase
        .from('opportunities')
        .select('*')
        .eq('country', country)
        .or(`search_keyword.ilike.%${keyword}%,book_title.ilike.%${keyword}%`)
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (cachedOpp && cachedOpp.length > 0) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const createdAt = new Date(cachedOpp[0].created_at);

        // Só usa o cache se for recente E se já tiver search_keyword (registos novos)
        if (createdAt > oneWeekAgo && cachedOpp[0].search_keyword) {
          console.log("[Radar] Cache Hit! Retornando dados pré-salvos para economizar APIs.");
          return NextResponse.json({
            success: true,
            score: cachedOpp[0].viral_opportunity_score,
            data: cachedOpp[0]
          });
        }
      }
    }

    // Definição da palavra-chave de pesquisa nas APIs
    let apiSearchKeyword = idea?.problem ? idea.problem : keyword;

    // Se for combinação (crossover) com '+', extrai o primeiro nicho como termo de pesquisa principal nas APIs
    if (!idea && (apiSearchKeyword.includes(' + ') || apiSearchKeyword.includes('+'))) {
      apiSearchKeyword = apiSearchKeyword.includes(' + ') 
        ? apiSearchKeyword.split(' + ')[0].trim() 
        : apiSearchKeyword.split('+')[0].trim();
    }

    // 1. Buscar Livro
    console.log("[Radar] Buscando livro para:", apiSearchKeyword);
    let books = await GoogleBooksService.searchTrendingBooks(apiSearchKeyword, 1);
    
    if (!books.length && apiSearchKeyword !== keyword) {
      console.log("[Radar] Nenhum livro para a dor, tentando keyword geral...");
      const fallbackKeyword = keyword.includes(' + ') 
        ? keyword.split(' + ')[0].trim() 
        : (keyword.includes('+') ? keyword.split('+')[0].trim() : keyword);
      books = await GoogleBooksService.searchTrendingBooks(fallbackKeyword, 1);
    }

    if (!books.length) {
      console.log("[Radar] Nenhum livro encontrado!");
      return NextResponse.json({ error: 'Nenhum livro encontrado para o nicho principal ou dor.' }, { status: 404 });
    }
    const book = books[0];
    console.log("[Radar] Livro:", book.title);

    // 2, 3 & 3.5. Buscar Trends, Reddit e Facebook em Paralelo para maior velocidade
    console.log("[Radar] Buscando Trends, Reddit e Facebook em paralelo...");
    const [trendsData, redditData, facebookData] = await Promise.all([
      TrendsService.getKeywordGrowth(apiSearchKeyword, country),
      RedditService.getSocialValidation(apiSearchKeyword),
      FacebookService.getSocialValidation(apiSearchKeyword)
    ]);
    console.log("[Radar] Sinais obtidos em paralelo:", { trendsData, redditData, facebookData });

    // 4. Processamento via IA (Groq/Llama3)
    console.log("[Radar] Iniciando Groq Pipeline Multi-Agente...");
    const aiInsight = await GroqService.generateOpportunity(book, trendsData, redditData, facebookData, country, idea || keyword);
    if (!aiInsight) {
      console.log("[Radar] Falha na IA. aiInsight é null.");
      return NextResponse.json({ error: 'Falha na geração de IA' }, { status: 500 });
    }
    console.log("[Radar] IA concluída com sucesso!");

    // 4.5. Buscar Pesos da IA (Configurações do Admin)
    let aiWeights = { trends: 25, reddit: 20, facebook: 20, book: 20, ai: 15 };
    try {
      const { data: settings } = await authSupabase.from('system_settings').select('value').eq('id', 'ai_weights').single();
      if (settings?.value) {
        aiWeights = settings.value as typeof aiWeights;
      }
    } catch (e) {
      console.log("[Radar] Usando pesos padrão para o score.");
    }

    // 5. Motor de Pontuação
    let viralScore = calculateViralScore(
      trendsData.monthlyGrowth, 
      redditData.mentions, 
      facebookData.adsCount, 
      facebookData.groupsCount, 
      aiInsight.aiOpportunityScore,
      aiWeights
    );

    // Ajusta o score para condizer exatamente com a quantidade de estrelas (tier) selecionada
    if (tier !== undefined && tier !== null) {
      const targetTier = Number(tier);
      let minScore = 0;
      let maxScore = 100;
      
      if (targetTier >= 6) {
        minScore = 95;
        maxScore = 100;
      } else if (targetTier === 5) {
        minScore = 80;
        maxScore = 94;
      } else if (targetTier === 4) {
        minScore = 60;
        maxScore = 79;
      } else if (targetTier === 3) {
        minScore = 40;
        maxScore = 59;
      } else if (targetTier === 2) {
        minScore = 20;
        maxScore = 39;
      } else if (targetTier <= 1) {
        minScore = 5;
        maxScore = 19;
      }

      if (viralScore < minScore || viralScore > maxScore) {
        // Gera um score dinâmico e realista dentro do intervalo do tier desejado
        viralScore = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      }
    }

    // 6. Salvar no Supabase
    const { data: insertedData, error: dbError } = await authSupabase
      .from('opportunities')
      .insert([
        {
          book_title: book.title,
          book_author: book.authors[0],
          book_category: book.categories[0],
          book_description: book.description,
          country: country,
          user_id: user.id,
          // Keyword original usada para buscar Facebook/Reddit/Trends
          // Garante sincronia entre os números exibidos e os links da Ads Library
          search_keyword: apiSearchKeyword,
          trends_growth_monthly: trendsData.monthlyGrowth,
          reddit_mentions: redditData.mentions,
          facebook_ads_count: facebookData.adsCount,
          facebook_groups_count: facebookData.groupsCount,
          viral_opportunity_score: viralScore,
          saas_name: aiInsight.saasName,
          problem_solved: aiInsight.problemSolved,
          target_audience: aiInsight.targetAudience,
          competitive_advantage: aiInsight.competitiveAdvantage,
          mvp_features: aiInsight.mvpFeatures,
          monetization_model: aiInsight.monetizationModel,
          suggested_price: aiInsight.suggestedPrice,
          potential_revenue: aiInsight.potentialRevenue,
          implementation_difficulty: aiInsight.implementationDifficulty,
          development_time: aiInsight.developmentTime,
          prompt_lovable: aiInsight.promptLovable,
          prompt_bolt: aiInsight.promptBolt,
        }
      ])
      .select();

    if (dbError) {
      console.error("Supabase Error:", dbError);
      return NextResponse.json({ error: 'Erro de banco de dados', details: dbError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      score: viralScore,
      data: insertedData ? insertedData[0] : null
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authSupabase = await createClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    // Criar cliente admin para lidar com deleções em cascata e contornar RLS em tabelas dependentes
    const adminSupabase = createAdminClient();

    // 1. Buscar a oportunidade para checar propriedade antes de deletar via admin
    const { data: opportunity, error: fetchError } = await adminSupabase
      .from('opportunities')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    // 2. Proteção de segurança: apenas o dono ou o admin pode excluir a oportunidade
    const isAdminUser = await checkAdmin(authSupabase, user);
    if (opportunity.user_id !== user.id && !isAdminUser) {
      return NextResponse.json({ error: 'Não autorizado a excluir esta oportunidade' }, { status: 403 });
    }

    // 3. Excluir os favoritos associados
    await adminSupabase
      .from('user_favorites')
      .delete()
      .eq('opportunity_id', id);

    // 4. Buscar as Landing Pages vinculadas para apagar seus leads primeiro
    const { data: landingPages } = await adminSupabase
      .from('landing_pages')
      .select('id')
      .eq('opportunity_id', id);

    if (landingPages && landingPages.length > 0) {
      const lpIds = landingPages.map(lp => lp.id);
      
      // Excluir os leads capturados nessas Landing Pages
      await adminSupabase
        .from('waitlist_leads')
        .delete()
        .in('landing_page_id', lpIds);
        
      // Excluir as Landing Pages vinculadas
      await adminSupabase
        .from('landing_pages')
        .delete()
        .eq('opportunity_id', id);
    }

    // 5. Por fim, excluir a oportunidade principal
    const { error: deleteError } = await adminSupabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("[Radar DELETE] Erro ao deletar oportunidade:", deleteError);
      return NextResponse.json({ error: 'Erro de banco de dados ao excluir', details: deleteError }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Radar DELETE] Erro inesperado:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
