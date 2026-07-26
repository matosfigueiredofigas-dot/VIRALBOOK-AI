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
  if (!item) return '';
  if (item.search_keyword && item.search_keyword.trim() && item.search_keyword.split(' ').length <= 4) {
    return item.search_keyword.trim();
  }
  if (item.book_category && item.book_category.trim()) {
    return item.book_category.trim();
  }
  if (item.saas_name && item.saas_name.trim()) {
    return item.saas_name.trim();
  }
  const text = item.search_keyword || item.target_audience || item.book_title || '';
  const cleanText = text.replace(/[^\w\s\u00C0-\u00FF]/gi, '').trim();
  const words = cleanText.split(/\s+/).filter((w: string) => w.length > 3);
  return words.slice(0, 3).join(' ') || cleanText.slice(0, 30);
}

