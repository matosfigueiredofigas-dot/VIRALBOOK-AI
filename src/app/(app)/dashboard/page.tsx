import { createClient, getCachedUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { OpportunitiesList } from "@/components/opportunities-list";
import { AdvancedFilters } from "@/components/advanced-filters";
import { MarketMarquee } from "@/components/market-marquee";
import { DashboardHeader } from "@/components/dashboard-header";
import { getFilterDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: { searchParams: Promise<{ country?: string, time?: string, search?: string, minScore?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "7d";
  const search = searchParams.search || "";
  const minScore = searchParams.minScore ? parseInt(searchParams.minScore) : 0;
  
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('id, created_at, saas_name, problem_solved, viral_opportunity_score, country, trends_growth_monthly, reddit_mentions, facebook_ads_count, facebook_groups_count, target_audience, competitive_advantage, suggested_price, book_category')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (country && country !== "ALL") {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  if (minScore > 0) {
    query = query.gte('viral_opportunity_score', minScore);
  }

  if (search) {
    query = query.or(`saas_name.ilike.%${search}%,problem_solved.ilike.%${search}%,book_category.ilike.%${search}%`);
  }

  const { data: opportunities } = await query;

  const totalOpps = opportunities?.length || 0;
  const avgScore = totalOpps > 0 
    ? Math.round(opportunities!.reduce((acc, curr) => acc + curr.viral_opportunity_score, 0) / totalOpps)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Client Header & Stats */}
      <DashboardHeader
        country={country}
        time={time}
        totalOpps={totalOpps}
        avgScore={avgScore}
      />

      {/* Marquee Global Trends */}
      <MarketMarquee opportunities={opportunities || []} />

      {/* Advanced Filters */}
      <AdvancedFilters />

      {/* Opportunities List */}
      <OpportunitiesList initialData={opportunities || []} hideSearch={true} />
    </div>
  );
}
