import { NextResponse } from 'next/server';
import { GoogleBooksService } from '@/services/GoogleBooksService';
import { TrendsService } from '@/services/TrendsService';
import { RedditService } from '@/services/RedditService';
import { FacebookService } from '@/services/FacebookService';
import { GroqService } from '@/services/GroqService';
import { createClient } from '@/utils/supabase/server';

// Lógica de cálculo do Viral Opportunity Score (0-100)
// 25% Trends, 20% Reddit, 20% Facebook (Ads + Groups), 20% Livro, 15% IA
function calculateViralScore(trendsGrowth: number, redditMentions: number, facebookAds: number, facebookGroups: number, aiScore: number = 70) {
  const trendsWeight = Math.min((trendsGrowth / 100) * 25, 25); // Máx 25 pts se cresceu 100%+
  const redditWeight = Math.min((redditMentions / 50) * 20, 20); // Máx 20 pts se tiver >= 50 menções
  const facebookWeight = Math.min(((facebookAds * 3 + facebookGroups) / 30) * 20, 20); // Máx 20 pts para Ads/Groups no FB
  const bookWeight = 20; // Fixo para MVP simplificado
  const aiWeight = (aiScore / 100) * 15;
  
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

    const { keyword, country = 'ALL', idea } = await request.json();

    // 0.5 Cache: Se já buscamos esse livro/termo nos últimos 7 dias, retorna do cache (apenas para pesquisas gerais sem ideia estruturada)
    if (!idea) {
      console.log("[Radar] Checando cache para:", keyword);
      const { data: cachedOpp } = await authSupabase
        .from('opportunities')
        .select('*')
        .eq('country', country)
        .or(`book_title.ilike.%${keyword}%,problem_solved.ilike.%${keyword}%,target_audience.ilike.%${keyword}%`)
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (cachedOpp && cachedOpp.length > 0) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const createdAt = new Date(cachedOpp[0].created_at);

        if (createdAt > oneWeekAgo) {
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

    // 2. Buscar Google Trends
    console.log("[Radar] Buscando Trends...");
    const trendsData = await TrendsService.getKeywordGrowth(apiSearchKeyword, country);
    console.log("[Radar] Trends Data:", trendsData);

    // 3. Buscar Validação Social (Reddit)
    console.log("[Radar] Buscando Reddit...");
    const redditData = await RedditService.getSocialValidation(apiSearchKeyword);
    console.log("[Radar] Reddit Data:", redditData);

    // 3.5 Buscar Validação Social (Facebook)
    console.log("[Radar] Buscando Facebook...");
    const facebookData = await FacebookService.getSocialValidation(apiSearchKeyword);
    console.log("[Radar] Facebook Data:", facebookData);

    // 4. Processamento via IA (Groq/Llama3)
    console.log("[Radar] Iniciando Groq Pipeline Multi-Agente...");
    const aiInsight = await GroqService.generateOpportunity(book, trendsData, redditData, facebookData, country, idea || keyword);
    if (!aiInsight) {
      console.log("[Radar] Falha na IA. aiInsight é null.");
      return NextResponse.json({ error: 'Falha na geração de IA' }, { status: 500 });
    }
    console.log("[Radar] IA concluída com sucesso!");

    // 5. Motor de Pontuação
    const viralScore = calculateViralScore(
      trendsData.monthlyGrowth, 
      redditData.mentions, 
      facebookData.adsCount, 
      facebookData.groupsCount, 
      aiInsight.aiOpportunityScore
    );

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

    // Deleta dos favoritos primeiro para evitar erro de constraint de chave estrangeira
    await authSupabase
      .from('user_favorites')
      .delete()
      .eq('opportunity_id', id);

    let query = authSupabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    // Em produção, garante que o usuário só deleta as próprias oportunidades
    if (process.env.NODE_ENV !== 'development') {
      query = query.eq('user_id', user.id);
    }

    const { error } = await query;
    if (error) {
      console.error("[Radar DELETE] Erro ao deletar:", error);
      return NextResponse.json({ error: 'Erro de banco de dados ao excluir', details: error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
