import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function NichesPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const searchParams = await props.searchParams;
  const country = searchParams.country || "US";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('book_category, viral_opportunity_score, country')
    .eq('country', country)
    .order('viral_opportunity_score', { ascending: false });

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
          Emerging Niches em {country}
        </h1>
        <p className="text-muted-foreground mt-2">
          As categorias com mais bolhas de hype no mercado selecionado.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {niches.map((niche, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg line-clamp-1">{niche.name}</CardTitle>
              <CardDescription>{niche.count} oportunidades</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={niche.maxScore >= 80 ? "default" : "secondary"}>
                Hype Score: {niche.maxScore}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {!niches.length && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhum nicho mapeado neste país.
          </div>
        )}
      </div>
    </div>
  )
}
