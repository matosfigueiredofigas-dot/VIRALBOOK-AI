"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, MessageSquare, Star, Flame, Sparkles, LayoutGrid, Map as MapIcon, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { MarketMarquee } from "@/components/market-marquee";

function getStarRating(growth: number, mentions: number) {
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

function generateSparklineData(growth: number) {
  const data = [];
  let currentVal = 10;
  // Create a 12 point curve that roughly ends at +growth%
  for (let i = 1; i <= 12; i++) {
    // Inject some random noise but maintain the upward trend based on growth
    const jump = (growth / 12) + (Math.random() * (growth/20) - (growth/40));
    currentVal += jump;
    data.push({ month: i, value: currentVal });
  }
  return data;
}

export function TrendsClient({ trends, country }: { trends: any[], country: string }) {
  const [viewMode, setViewMode] = useState<"grid" | "heatmap">("grid");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const top5 = trends.slice(0, 5);
      const res = await fetch("/api/trends/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topNiches: top5 })
      });
      const data = await res.json();
      if (res.ok) {
        setAiAnalysis(data.summary);
      } else {
        alert("Erro na IA: " + data.error);
      }
    } catch (e) {
      alert("Erro de conexão.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Ticker (Marquee) */}
      <MarketMarquee opportunities={trends} />

      {/* AI Market Insight */}
      <Card className="border-primary/20 bg-primary/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="text-lg font-extrabold text-foreground">Visão de Mercado da IA</h2>
            </div>
            {!aiAnalysis && (
              <button 
                onClick={handleGenerateAnalysis}
                disabled={isAnalyzing || trends.length === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gerar Análise Profunda"}
              </button>
            )}
          </div>
          
          {aiAnalysis ? (
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
              {aiAnalysis}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Deixe nossa IA analisar os {trends.length} nichos do momento e revelar a oportunidade oculta.
            </p>
          )}
        </CardContent>
      </Card>

      {/* View Toggles */}
      <div className="flex justify-between items-center bg-muted/30 border border-border/50 p-2 rounded-xl">
        <span className="text-sm font-semibold text-muted-foreground ml-2">Monitorando {trends.length} oportunidades</span>
        <div className="flex bg-background/50 p-1 rounded-lg border border-border/50">
          <button 
            onClick={() => setViewMode("grid")}
            className={cn("px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all", viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-muted-foreground hover:text-white")}
          >
            <LayoutGrid className="h-4 w-4" /> Cards
          </button>
          <button 
            onClick={() => setViewMode("heatmap")}
            className={cn("px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-bold transition-all", viewMode === "heatmap" ? "bg-zinc-800 text-white shadow-sm" : "text-muted-foreground hover:text-white")}
          >
            <MapIcon className="h-4 w-4" /> Heatmap
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
          {trends?.map((trend, i) => {
            const stars = getStarRating(trend.trends_growth_monthly, trend.reddit_mentions);
            const isTop1 = i === 0;
            const isTop3 = i > 0 && i < 3;
            const sparkData = generateSparklineData(trend.trends_growth_monthly);

            return (
              <Card 
                key={i} 
                className={cn(
                  "glass-card transition-all group overflow-hidden relative",
                  isTop1 ? "border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]" : 
                  isTop3 ? "border-orange-500/30 hover:border-orange-500/50" : 
                  "hover:border-primary/30"
                )}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame className="h-32 w-32" />
                </div>
                
                <CardHeader className="pb-2 relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <StarRating stars={stars} />
                    <span className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm",
                      isTop1 ? "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-yellow-500/50" :
                      isTop3 ? "bg-zinc-800 text-zinc-300" :
                      "bg-white/5 text-muted-foreground"
                    )}>
                      Rank #{i + 1}
                    </span>
                  </div>
                  <CardTitle className={cn("text-xl line-clamp-1", isTop1 ? "text-yellow-400" : "")}>{trend.saas_name}</CardTitle>
                  <CardDescription className="font-medium text-primary/80 text-xs">{trend.book_category}</CardDescription>
                </CardHeader>

                <CardContent className="relative z-10 pb-4">
                  {/* Sparkline Chart */}
                  <div className="h-16 w-full mt-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`colorGrowth${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isTop1 ? "#eab308" : "#22c55e"} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={isTop1 ? "#eab308" : "#22c55e"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={isTop1 ? "#eab308" : "#22c55e"} 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill={`url(#colorGrowth${i})`} 
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Crescimento Mensal</p>
                      <p className={cn("font-black text-2xl drop-shadow-md", isTop1 ? "text-yellow-400 shadow-yellow-500/20" : "text-green-500 shadow-green-500/20")}>
                        +{trend.trends_growth_monthly}%
                      </p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center justify-end gap-1">
                        <MessageSquare className="h-3 w-3" /> Demand (Reddit)
                      </p>
                      <p className="font-bold text-white text-lg">{trend.reddit_mentions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Heatmap View */}
      {viewMode === "heatmap" && (
        <div className="flex flex-wrap gap-2 p-2 bg-black/20 rounded-xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
          {trends?.map((trend, i) => {
            // Tamanho baseado no crescimento (max 200px, min 80px)
            const baseSize = 80;
            const growthFactor = Math.min(trend.trends_growth_monthly, 300) / 300; 
            const width = baseSize + (120 * growthFactor);
            const height = baseSize + (80 * growthFactor);
            
            // Cor baseada no score de viralidade
            const score = trend.viral_opportunity_score || 0;
            const bgColor = score >= 80 ? "bg-green-600 hover:bg-green-500" :
                            score >= 60 ? "bg-emerald-700 hover:bg-emerald-600" :
                            score >= 40 ? "bg-yellow-700 hover:bg-yellow-600" :
                            "bg-orange-800 hover:bg-orange-700";

            return (
              <div 
                key={i}
                className={cn(
                  "rounded-md p-3 flex flex-col justify-between cursor-pointer transition-all border border-black/20 shadow-sm",
                  bgColor
                )}
                style={{ width: `${width}px`, height: `${height}px`, flexGrow: growthFactor > 0.5 ? 1 : 0 }}
                title={`${trend.saas_name} | Score: ${score} | Crescimento: +${trend.trends_growth_monthly}%`}
              >
                <span className="font-black text-white text-xs sm:text-sm line-clamp-2 leading-tight drop-shadow-md">
                  {trend.saas_name}
                </span>
                <div className="flex justify-between items-end w-full">
                  <span className="text-[10px] text-white/70 font-bold">+{trend.trends_growth_monthly}%</span>
                  <span className="text-[10px] font-mono bg-black/30 px-1 rounded text-white">{score}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!trends?.length && (
        <div className="py-12 text-center text-muted-foreground">
          Nenhuma tendência monitorada neste momento.
        </div>
      )}
    </div>
  );
}
