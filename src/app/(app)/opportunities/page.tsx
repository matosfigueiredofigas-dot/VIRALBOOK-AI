import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Code, DollarSign } from "lucide-react"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const searchParams = await props.searchParams;
  const country = searchParams.country || "US";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('saas_name, problem_solved, target_audience, monetization_model, potential_revenue, implementation_difficulty')
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {opportunities?.map((opp, i) => (
          <Card key={i} className="flex flex-col glass-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
            <CardHeader className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">{opp.implementation_difficulty}</Badge>
              </div>
              <CardTitle className="text-xl">{opp.saas_name}</CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground">{opp.problem_solved}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4 relative z-10">
              <div className="flex items-start gap-2 text-sm text-foreground/80">
                <Code className="h-4 w-4 mt-0.5 text-blue-400" />
                <span><strong>Público:</strong> {opp.target_audience}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-foreground/80">
                <DollarSign className="h-4 w-4 mt-0.5 text-green-500" />
                <span><strong>MRR Potencial:</strong> {opp.potential_revenue} ({opp.monetization_model})</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {!opportunities?.length && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhuma oportunidade mapeada neste país.
          </div>
        )}
      </div>
    </div>
  )
}
