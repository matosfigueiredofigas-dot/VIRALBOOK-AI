"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Activity, Sparkles, Loader2, Target, Crown, Zap } from "lucide-react"

interface Niche {
  name: string
  count: number
  maxScore: number
}

interface Opportunity {
  saas_name: string
  book_category: string
  viral_opportunity_score: number
  country: string
}

interface NichesClientProps {
  niches: Niche[]
  opportunities: Opportunity[]
  country: string
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

export function NichesClient({ niches, opportunities, country }: NichesClientProps) {
  const [loadingAi, setLoadingAi] = useState(false)
  const [aiInsight, setAiInsight] = useState<string | null>(null)

  // Top 10 Opportunities for the Leaderboard
  const topOpportunities = [...opportunities]
    .sort((a, b) => b.viral_opportunity_score - a.viral_opportunity_score)
    .slice(0, 10);

  // Data for Donut Chart
  const chartData = niches.slice(0, 8).map(niche => ({
    name: niche.name,
    value: niche.count
  }));

  const handleGenerateInsight = async () => {
    setLoadingAi(true);
    setAiInsight(null);
    try {
      const top3Niches = niches.slice(0, 3);
      const res = await fetch('/api/niches/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topNiches: top3Niches })
      });
      const data = await res.json();
      if (data.insight) {
        setAiInsight(data.insight);
      } else {
        setAiInsight("Não foi possível gerar a síntese de mercado no momento.");
      }
    } catch (e) {
      setAiInsight("Erro de conexão ao tentar gerar o insight.");
    } finally {
      setLoadingAi(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-yellow-500 shadow-yellow-500/20';
    if (score >= 70) return 'text-green-500 shadow-green-500/20';
    return 'text-blue-500 shadow-blue-500/20';
  };

  const getScoreGlow = (score: number) => {
    if (score >= 90) return 'shadow-[0_0_15px_rgba(234,179,8,0.3)] border-yellow-500/50';
    if (score >= 70) return 'shadow-[0_0_15px_rgba(34,197,94,0.2)] border-green-500/30';
    return 'border-blue-500/20';
  };

  return (
    <div className="space-y-8">
      {/* AI Synthesis Header */}
      <Card className="glass-card border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <CardHeader className="pb-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                Sintetizador de Macro-Tendência
              </CardTitle>
              <CardDescription>Conecte seus top nichos para descobrir o Oceano Azul perfeito.</CardDescription>
            </div>
            <Button 
              onClick={handleGenerateInsight} 
              disabled={loadingAi || niches.length === 0}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25"
            >
              {loadingAi ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando Mercados...</>
              ) : (
                <><Zap className="mr-2 h-4 w-4" /> Gerar Insight com IA</>
              )}
            </Button>
          </div>
        </CardHeader>
        {aiInsight && (
          <CardContent className="relative z-10 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-slate-200 font-medium">
                {aiInsight}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Niches Grid & Donut Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Market Share Donut Chart */}
          {chartData.length > 0 && (
            <Card className="glass-card overflow-hidden bg-black/20">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Market Share de Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center p-0 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: 'white', fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Niches Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {niches.map((niche, i) => (
              <Card key={i} className={`glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${getScoreGlow(niche.maxScore)} bg-black/30`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1 flex-1">{niche.name}</CardTitle>
                    {/* Fake Radial Progress representation */}
                    <div className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/5 bg-black/50 overflow-hidden shrink-0">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-primary/20"
                        style={{ height: \`\${niche.maxScore}%\` }}
                      ></div>
                      <span className={\`relative text-[10px] font-black \${getScoreColor(niche.maxScore)}\`}>
                        {niche.maxScore}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="text-xs">{niche.count} startups rastreadas</CardDescription>
                </CardHeader>
              </Card>
            ))}

            {!niches.length && (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 border border-white/5 rounded-xl">
                Nenhum nicho mapeado neste país. Use o radar para iniciar o rastreamento!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Leaderboard */}
        <div className="space-y-6">
          <Card className="glass-card border-yellow-500/20 relative overflow-hidden bg-black/40">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-500 font-bold">
                <Crown className="h-5 w-5" />
                Top Startups Leaderboard
              </CardTitle>
              <CardDescription>As 10 melhores oportunidades da base</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {topOpportunities.map((opp, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-6 font-mono font-black text-xs text-muted-foreground text-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : \`\${idx+1}\`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-foreground truncate">{opp.saas_name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{opp.book_category}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={\`font-black \${getScoreGlow(opp.viral_opportunity_score)}\`}>
                        {opp.viral_opportunity_score}
                      </Badge>
                    </div>
                  </div>
                ))}

                {!topOpportunities.length && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Sem oportunidades suficientes.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
