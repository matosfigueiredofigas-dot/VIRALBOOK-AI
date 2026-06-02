import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, MessageSquare, Sparkles, Globe, Lock } from "lucide-react"

export const dynamic = 'force-dynamic';

export default async function SharedOpportunityPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // Usando admin supabase (sem verificação de user) para rota pública
  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  const score = opportunity.viral_opportunity_score || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Header da Página Compartilhada */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="h-3 w-3" />
            Acesso Restrito via Link
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            {opportunity.saas_name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {opportunity.problem_solved}
          </p>
        </div>

        <Card className="glass-card overflow-hidden border-primary/20 shadow-xl shadow-primary/5">
          <div className="h-2 bg-gradient-to-r from-primary to-blue-500 w-full" />
          <CardHeader className="bg-muted/30 pb-6 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={score >= 80 ? "default" : "secondary"} className="text-sm py-1">
                Score Viral: {score}
              </Badge>
              <Badge variant="outline" className="text-sm py-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                {score >= 95 ? "🌟🌟🌟🌟🌟🌟 (>5 Estrelas)" : 
                 score >= 80 ? "⭐⭐⭐⭐⭐ (5 Estrelas)" : 
                 score >= 60 ? "⭐⭐⭐⭐ (4 Estrelas)" : "⭐⭐⭐"}
              </Badge>
              <Badge variant="outline" className="text-sm py-1">
                <Globe className="h-3 w-3 mr-1" /> {opportunity.country}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            
            {/* Métricas e Validação */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 dark:bg-black/20 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold text-green-500">+{opportunity.trends_growth_monthly}%</span>
                <span className="text-sm text-muted-foreground">Crescimento Google</span>
              </div>
              <div className="bg-black/5 dark:bg-black/20 p-4 rounded-xl border border-border/50 flex flex-col items-center justify-center text-center">
                <MessageSquare className="h-6 w-6 text-orange-500 mb-2" />
                <span className="text-2xl font-bold text-orange-500">{opportunity.reddit_mentions} refs</span>
                <span className="text-sm text-muted-foreground">Validação Reddit</span>
              </div>
            </div>

            <Separator />

            {/* Business Model */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Público-Alvo</h4>
                  <p className="text-foreground leading-relaxed">{opportunity.target_audience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Diferencial (Moat)</h4>
                  <p className="text-foreground leading-relaxed">{opportunity.competitive_advantage}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Monetização & Preço</h4>
                  <p className="text-foreground leading-relaxed font-medium">
                    {opportunity.monetization_model}
                    <span className="block text-green-500 mt-1">{opportunity.suggested_price}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Receita Potencial</h4>
                  <p className="text-foreground leading-relaxed">{opportunity.potential_revenue}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Execução */}
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Plano de Execução (MVP 30 Dias)
              </h4>
              <p className="text-foreground leading-relaxed mb-4">{opportunity.mvp_features}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-background">⏱️ {opportunity.development_time}</Badge>
                <Badge variant="outline" className="bg-background">🧠 Dificuldade: {opportunity.implementation_difficulty}</Badge>
              </div>
            </div>

          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground mb-4">Gerado por Inteligência Artificial</p>
          <a href="/" className="inline-flex items-center justify-center font-bold text-primary hover:underline">
            Descubra suas próprias ideias com ViralBook AI &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}
