import { NextResponse } from 'next/server';
import { GoogleBooksService } from '@/services/GoogleBooksService';
import { TrendsService } from '@/services/TrendsService';
import { RedditService } from '@/services/RedditService';
import { FacebookService } from '@/services/FacebookService';
import { GroqService } from '@/services/GroqService';
import { createAdminClient } from '@/utils/supabase/admin';

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

// Permite que a função rode por até 60 segundos na Vercel (ideal para as 3 chamadas da IA)
export const maxDuration = 60;

// Lista massiva de nichos para o robô sortear e analisar todo dia
const NICHES = [
  "Artificial Intelligence", "Mindful Productivity", "Creator Economy", "Personal Finance", 
  "Remote Work", "Solo Founder", "Biohacking", "Sustainable Living", "No-code Development", 
  "Digital Nomad", "Longevity", "Micro-SaaS", "Indie Hacking", "B2B SaaS Growth", 
  "E-commerce Automation", "Voice AI", "Autonomous Agents", "Facial Recognition Tech", 
  "Virtual Reality Productivity", "Web3 Gaming", "Crypto Trading Bots", "Automated Trading", 
  "Dropshipping Niches", "Print on Demand", "Affiliate Marketing Automation", "Cold Emailing", 
  "Sales Funnels", "Copywriting AI", "SEO Optimization", "Local Business Marketing", 
  "Real Estate Tech", "PropTech", "FinTech Startups", "EdTech", "Online Course Creation", 
  "High Ticket Sales", "Mental Health Tech", "Telemedicine", "Fitness Coaching Online", 
  "Diet Tracking", "Vegan Lifestyle", "Urban Farming", "Smart Home Automation", 
  "Drone Photography", "3D Printing Business", "Pet Care Tech", "Astrology Apps", 
  "Language Learning AI", "Music Production Tech", "Podcast Monetization", "Newsletter Growth"
];

export async function GET(request: Request) {
  const adminSupabase = createAdminClient();
  try {
    // Segurança: Verifica se a requisição tem a chave secreta de autorização
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const country = 'US';
    const successfulOpportunities = [];

    // O robô vai rodar 3 vezes seguidas para buscar 3 nichos diferentes por noite
    for (let i = 0; i < 3; i++) {
      try {
        // Sorteia um nicho aleatório da nossa lista para analisar hoje
        const randomNiche = NICHES[Math.floor(Math.random() * NICHES.length)];

        // Executa a Pipeline
        const books = await GoogleBooksService.searchTrendingBooks(randomNiche, 1);
        if (!books.length) continue; // Pula se não achar livros
        
        const book = books[0];
        const trendsData = await TrendsService.getKeywordGrowth(randomNiche, country);
        const redditData = await RedditService.getSocialValidation(randomNiche);
        const facebookData = await FacebookService.getSocialValidation(randomNiche);
        const aiInsight = await GroqService.generateOpportunity(book, trendsData, redditData, facebookData, country);
        
        if (!aiInsight) continue;

        const viralScore = calculateViralScore(
          trendsData.monthlyGrowth, 
          redditData.mentions, 
          facebookData.adsCount, 
          facebookData.groupsCount, 
          aiInsight.aiOpportunityScore
        );

        // Salva no Supabase usando o cliente administrador
        await adminSupabase.from('opportunities').insert([{
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
        }]);

        successfulOpportunities.push({ niche: randomNiche, score: viralScore });
      } catch (innerError) {
        // Ignora erro de uma iteração específica e tenta a próxima
        console.error("Erro na iteração", i, innerError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Radar executado com sucesso! Foram extraídas ${successfulOpportunities.length} novas oportunidades.`,
      opportunities: successfulOpportunities
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

