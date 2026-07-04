import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Activity } from "lucide-react"

import { getFilterDate } from "@/lib/utils"
import { NichesClient } from "@/components/niches-client"

export const dynamic = 'force-dynamic';

export default async function NichesPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "now";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('saas_name, book_category, viral_opportunity_score, country, trends_growth_monthly')
    .eq('user_id', user.id)
    .order('viral_opportunity_score', { ascending: false });

  if (country !== "ALL") {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: opportunities } = await query;

  const nichesMap = opportunities?.reduce((acc: any, curr) => {
    const cat = curr.book_category || 'Desconhecido';
    if (!acc[cat]) acc[cat] = { count: 0, maxScore: 0 };
    acc[cat].count += 1;
    if (curr.viral_opportunity_score > acc[cat].maxScore) acc[cat].maxScore = curr.viral_opportunity_score;
    return acc;
  }, {});

  const niches = Object.keys(nichesMap || {}).map(key => ({
    name: key,
    ...nichesMap[key]
  })).sort((a, b) => b.maxScore - a.maxScore);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-500" />
          Emerging Niches em {country === 'ALL' ? 'TODOS PAÍSES' : country}
        </h1>
        <p className="text-muted-foreground mt-2">
          As categorias com mais bolhas de hype no mercado selecionado.
        </p>
      </div>

      <NichesClient 
        niches={niches} 
        opportunities={opportunities || []} 
        country={country} 
      />
    </div>
  )
}
