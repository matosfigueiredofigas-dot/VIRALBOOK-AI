import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Award, FileSpreadsheet, Sparkles, TrendingUp } from "lucide-react"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function NichesPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('book_category, viral_opportunity_score, country')
    .or(`user_id.is.null,user_id.eq.${user.id}`)
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Coluna da Esquerda (2/3) - Nichos Mapeados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {niches.map((niche, i) => (
              <Card key={i} className="glass-card hover:border-blue-500/25 transition-all">
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
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 border border-white/5 rounded-xl">
                Nenhum nicho mapeado neste país. Use o radar para iniciar o rastreamento!
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita (1/3) - Rankings e Metodologia */}
        <div className="space-y-6">
          {/* Card 1: Ranking de Potencial de Nichos */}
          <Card className="glass-card border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-400">
                <Award className="h-5 w-5" />
                Ranking de Potencial de Nichos
              </CardTitle>
              <CardDescription>Mercados mais promissores mapeados para 2026</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="p-3 font-semibold text-muted-foreground">Nicho</th>
                      <th className="p-3 font-semibold text-muted-foreground text-right">Potencial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "IA para Vídeos", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "IA para Imagens", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "Finanças Pessoais", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "Educação com IA", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "Networking Profissional", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "Marketplace de Serviços", potential: "Muito Alta", color: "text-green-500 bg-green-500/10 border-green-500/20" },
                      { name: "Fitness Premium", potential: "Alta", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                      { name: "Idiomas", potential: "Alta", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                      { name: "Moda IA", potential: "Alta", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                      { name: "Relacionamentos", potential: "Alta", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
                    ].map((r, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 font-medium text-foreground">{r.name}</td>
                        <td className="p-3 text-right">
                          <Badge variant="outline" className={r.color}>
                            {r.potential}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Planilha de Oportunidades de Startup */}
          <Card className="glass-card border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-400">
                <FileSpreadsheet className="h-5 w-5" />
                Matriz de Priorização (Startups)
              </CardTitle>
              <CardDescription>Nota ponderada de oportunidade baseada em viabilidade e mercado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cada nicho é avaliado de **1 a 10** em critérios fundamentais para encontrar o melhor ROI (Nota Final):
              </p>
              <div className="overflow-x-auto border border-white/5 rounded-lg">
                <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="p-2 font-semibold text-muted-foreground">Nicho</th>
                      <th className="p-2 font-semibold text-muted-foreground">Dor</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center">TAM</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center">Desenv.</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center">Viral</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center">Monet.</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center">Concorr.</th>
                      <th className="p-2 font-semibold text-muted-foreground text-center text-primary font-bold">Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nicho: "Criador Vídeos Virais", dor: "Cortes demorados", tam: 9, des: 8, vir: 10, mon: 9, con: 7, nota: 8.5 },
                      { nicho: "Assistente Finanças IA", dor: "Controle de gastos", tam: 10, des: 7, vir: 8, mon: 9, con: 8, nota: 8.2 },
                      { nicho: "Educação com IA (Idiomas)", dor: "Conversação simulada", tam: 9, des: 8, vir: 9, mon: 8, con: 6, nota: 8.0 },
                      { nicho: "Simulador Entrevistas IA", dor: "Insegurança em processos", tam: 8, des: 9, vir: 7, mon: 8, con: 5, nota: 7.5 }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-2 font-medium text-foreground max-w-[100px] truncate">{row.nicho}</td>
                        <td className="p-2 text-muted-foreground max-w-[120px] truncate">{row.dor}</td>
                        <td className="p-2 text-center text-foreground font-semibold">{row.tam}</td>
                        <td className="p-2 text-center text-foreground font-semibold">{row.des}</td>
                        <td className="p-2 text-center text-foreground font-semibold">{row.vir}</td>
                        <td className="p-2 text-center text-foreground font-semibold">{row.mon}</td>
                        <td className="p-2 text-center text-foreground font-semibold">{row.con}</td>
                        <td className="p-2 text-center text-primary font-extrabold">{row.nota}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 text-xxs text-primary leading-relaxed flex items-start gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-yellow-400 fill-yellow-400" />
                <span>
                  <strong>Nota Final</strong> = Média ponderada de TAM, Viralidade e Monetização confrontada com Dificuldade de Desenvolvimento e barreiras de Concorrência.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
