import { NextResponse } from 'next/server';
import { GoogleBooksService } from '@/services/GoogleBooksService';
import { TrendsService } from '@/services/TrendsService';
import { RedditService } from '@/services/RedditService';
import { FacebookService } from '@/services/FacebookService';
import { GroqService } from '@/services/GroqService';
import { supabase } from '@/lib/supabase';

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
    const { keyword, country = 'US' } = await request.json();

    // 1. Buscar Livro
    console.log("[Radar] Buscando livro para:", keyword);
    const books = await GoogleBooksService.searchTrendingBooks(keyword, 1);
    if (!books.length) {
      console.log("[Radar] Nenhum livro encontrado!");
      return NextResponse.json({ error: 'Nenhum livro encontrado' }, { status: 404 });
    }
    const book = books[0];
    console.log("[Radar] Livro:", book.title);

    // 2. Buscar Google Trends
    console.log("[Radar] Buscando Trends...");
    const trendsData = await TrendsService.getKeywordGrowth(keyword, country);
    console.log("[Radar] Trends Data:", trendsData);

    // 3. Buscar Validação Social (Reddit)
    console.log("[Radar] Buscando Reddit...");
    const redditData = await RedditService.getSocialValidation(keyword);
    console.log("[Radar] Reddit Data:", redditData);

    // 3.5 Buscar Validação Social (Facebook)
    console.log("[Radar] Buscando Facebook...");
    const facebookData = await FacebookService.getSocialValidation(keyword);
    console.log("[Radar] Facebook Data:", facebookData);

    // 4. Processamento via IA (Groq/Llama3)
    console.log("[Radar] Iniciando Groq Pipeline Multi-Agente...");
    const aiInsight = await GroqService.generateOpportunity(book, trendsData, redditData, facebookData, country);
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
    const { data: insertedData, error: dbError } = await supabase
      .from('opportunities')
      .insert([
        {
          book_title: book.title,
          book_author: book.authors[0],
          book_category: book.categories[0],
          book_description: book.description,
          country: country,
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
