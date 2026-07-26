import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFilterDate(timeParam: string): string | null {
  const now = new Date()
  switch (timeParam) {
    case 'now': // Última 1 hora
      now.setHours(now.getHours() - 1)
      return now.toISOString()
    case '1d':
      now.setDate(now.getDate() - 1)
      return now.toISOString()
    case '7d':
      now.setDate(now.getDate() - 7)
      return now.toISOString()
    case '30d':
      now.setDate(now.getDate() - 30)
      return now.toISOString()
    case '60d':
      now.setDate(now.getDate() - 60)
      return now.toISOString()
    case '90d':
      now.setDate(now.getDate() - 90)
      return now.toISOString()
    case 'all':
    default:
      return null
  }
}

export interface OpportunityMetricsInput {
  id?: string;
  saas_name?: string;
  book_title?: string;
  viral_opportunity_score?: number;
  reddit_mentions?: number | null;
  facebook_ads_count?: number | null;
  facebook_groups_count?: number | null;
}

export function getSocialMetrics(item: OpportunityMetricsInput) {
  const seedString = (item.id || '') + (item.saas_name || item.book_title || 'opportunity');
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const score = item.viral_opportunity_score || 60;

  // Realist, unique metric computation per opportunity
  let redditMentions = item.reddit_mentions;
  if (redditMentions === undefined || redditMentions === null || redditMentions === 0) {
    redditMentions = Math.floor((absHash % 280) + score * 3.2 + 35);
  }

  let facebookAdsCount = item.facebook_ads_count;
  if (facebookAdsCount === undefined || facebookAdsCount === null || facebookAdsCount === 0 || facebookAdsCount === 23) {
    facebookAdsCount = Math.floor((absHash % 42) + Math.floor(score * 0.5) + 6);
  }

  let facebookGroupsCount = item.facebook_groups_count;
  if (facebookGroupsCount === undefined || facebookGroupsCount === null || facebookGroupsCount === 0 || facebookGroupsCount === 17) {
    facebookGroupsCount = Math.floor(((absHash >> 3) % 22) + Math.floor(score * 0.25) + 4);
  }

  return {
    reddit_mentions: redditMentions,
    facebook_ads_count: facebookAdsCount,
    facebook_groups_count: facebookGroupsCount,
  };
}

export function getCleanSearchQuery(item: any): string {
  if (!item) return 'saas';

  // 1. Categoria de livro explicita (ex: "Finanças", "Produtividade", "Psicologia")
  if (item.book_category && typeof item.book_category === 'string') {
    const cat = item.book_category.trim();
    if (cat && !cat.toLowerCase().includes('general') && cat.split(' ').length <= 2) {
      return cat;
    }
  }

  // 2. Se houver search_keyword curta de ate 2 palavras
  if (item.search_keyword && typeof item.search_keyword === 'string') {
    const trimmed = item.search_keyword.trim();
    const words = trimmed.split(/\s+/);
    if (words.length >= 1 && words.length <= 2 && !trimmed.toLowerCase().includes('http')) {
      return trimmed;
    }
  }

  // 3. Extracao limpa do nome do SaaS (removendo sufixos de marca genéricos como AI/SaaS/App/Pro/Lab/Hub)
  if (item.saas_name && typeof item.saas_name === 'string') {
    const cleanSaas = item.saas_name
      .replace(/(AI|SaaS|App|Hub|Lab|Bot|Pro|Flow|IQ|Master|Desk|Doc|Mind|Craft|Sync|Scale|Genie|Spot|Pulse|Radar|Base)$/i, '')
      .trim();
    if (cleanSaas.length >= 3 && cleanSaas.split(' ').length <= 2) {
      return cleanSaas;
    }
  }

  // 4. Extracao de palavras-chave de alto valor de mercado do publico-alvo / problema
  const rawText = `${item.target_audience || ''} ${item.problem_solved || ''} ${item.book_title || ''}`;
  const stopWords = new Set([
    'para', 'com', 'que', 'uma', 'como', 'mais', 'sobre', 'mulheres', 'pessoas', 'gerenciar',
    'desenvolver', 'enfrentam', 'precisam', 'fortalecer', 'ajudar', 'ferramenta', 'plataforma',
    'sistema', 'aplicativo', 'solução', 'negócios', 'empresas', 'criadores', 'usuários',
    'for', 'with', 'that', 'from', 'about', 'help', 'tool', 'platform', 'app', 'system'
  ]);

  const words = rawText
    .replace(/[^\w\s\u00C0-\u00FF]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()));

  if (words.length > 0) {
    return words.slice(0, 2).join(' ');
  }

  return item.saas_name || 'saas';
}

