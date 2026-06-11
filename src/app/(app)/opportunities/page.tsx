import { supabase } from "@/lib/supabase"
import { Lightbulb } from "lucide-react"

import { getFilterDate } from "@/lib/utils"
import { OpportunitiesGrid } from "@/components/opportunities-grid"

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const searchParams = await props.searchParams;
  const country = searchParams.country || "US";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('id, saas_name, problem_solved, target_audience, monetization_model, potential_revenue, implementation_difficulty')
    .eq('country', country)
    .order('created_at', { ascending: false });

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: opportunities } = await query;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-yellow-500" />
          SaaS Opportunities
        </h1>
        <p className="text-muted-foreground mt-2">
          Catálogo exclusivo das ideias geradas para o mercado de <strong className="text-foreground">{country}</strong>.
        </p>
      </div>

      <OpportunitiesGrid initialOpportunities={opportunities || []} />
    </div>
  )
}
