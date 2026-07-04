import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { BarChart3 } from "lucide-react"
import { AdvancedFilters } from "@/components/advanced-filters"
import { TrendsClient } from "@/components/trends-client"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function TrendsPage(props: { searchParams: Promise<{ country?: string, time?: string, search?: string, minScore?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "now";
  const search = searchParams.search || "";
  const minScore = searchParams.minScore ? parseInt(searchParams.minScore) : 0;
  
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('saas_name, book_category, trends_growth_monthly, reddit_mentions, viral_opportunity_score')
    .eq('user_id', user.id)
    .order('trends_growth_monthly', { ascending: false });

  if (country !== "ALL") {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  if (minScore > 0) {
    query = query.gte('viral_opportunity_score', minScore);
  }

  if (search) {
    query = query.or(`saas_name.ilike.%${search}%,book_category.ilike.%${search}%`);
  }

  const { data: trends } = await query;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-xl">
            <BarChart3 className="h-8 w-8 text-green-500" />
          </div>
          Global Trends ({country === 'ALL' ? 'TODOS PAÍSES' : country})
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Monitoramento em tempo real dos micro-nichos que estão explodindo em volume de buscas e discussões ativas.
        </p>
      </div>

      <AdvancedFilters />

      <TrendsClient trends={trends || []} country={country} />
    </div>
  )
}
