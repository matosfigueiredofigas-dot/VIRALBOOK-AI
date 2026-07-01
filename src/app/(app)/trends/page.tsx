import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, MessageSquare, Star, Flame } from "lucide-react"
import { AdvancedFilters } from "@/components/advanced-filters"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

function getStarRating(growth: number, mentions: number) {
  // Fórmula simples para mapear crescimento e reddit em 5 estrelas
  const score = (Math.min(growth, 100) / 100) * 50 + (Math.min(mentions, 50) / 50) * 50;
  if (score > 80) return 5;
  if (score > 60) return 4;
  if (score > 40) return 3;
  if (score > 20) return 2;
  return 1;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < stars ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/20'}`} />
      ))}
    </div>
  )
}

export default async function TrendsPage(props: { searchParams: Promise<{ country?: string, time?: string, search?: string, minScore?: string, view?: string }> }) {
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
  const viewMode = searchParams.view || "grid";
  
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
          Análise de crescimento e termômetro de validação no Reddit para cada mercado.
        </p>
      </div>

      <AdvancedFilters />

      <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4" : "flex flex-col gap-4 pt-4"}>
        {trends?.map((trend, i) => {
          const stars = getStarRating(trend.trends_growth_monthly, trend.reddit_mentions);
          // Barra de progresso visual para o Reddit (max 50)
          const redditPercent = Math.min((trend.reddit_mentions / 50) * 100, 100);

          return (
            <Card key={i} className="glass-card hover:border-primary/30 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="h-24 w-24 text-primary" />
              </div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <StarRating stars={stars} />
                  <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md text-muted-foreground">
                    Rank #{i + 1}
                  </span>
                </div>
                <CardTitle className="text-xl">{trend.saas_name}</CardTitle>
                <CardDescription className="font-medium text-primary/80">{trend.book_category}</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col gap-4 mt-2">
                  {/* Crescimento Mensal */}
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <TrendingUp className="h-4 w-4" />
                      Crescimento
                    </span>
                    <span className="font-bold text-green-500 shadow-green-500/20 drop-shadow-md text-lg">
                      +{trend.trends_growth_monthly}%
                    </span>
                  </div>

                  {/* Validação Reddit com Barra de Progresso */}
                  <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <MessageSquare className="h-4 w-4" />
                        Validação Reddit
                      </span>
                      <span className="font-bold text-white">{trend.reddit_mentions} refs</span>
                    </div>
                    {/* Barra Visual */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" 
                        style={{ width: `${redditPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 text-right uppercase tracking-wider font-semibold">
                      Termômetro de Demanda
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {!trends?.length && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhuma tendência monitorada neste país.
          </div>
        )}
      </div>
    </div>
  )
}
