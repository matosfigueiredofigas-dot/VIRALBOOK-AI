"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, Loader2, Sparkles, Copy, CheckCircle2, TrendingUp, Heart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function OpportunitiesList({ initialData, hideSearch = false }: { initialData: any[], hideSearch?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "grid";
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    setLoading(true);
    try {
      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, country: "US" }),
      });
      
      if (res.ok) {
        setKeyword("");
        router.refresh(); // Recarrega os dados do servidor
      } else {
        alert("Falha ao analisar a tendência.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar para acionar a IA */}
      {!hideSearch && (
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="pt-6">
            <form onSubmit={handleScan} className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Ex: Mindful Productivity, Personal Finance, Dieting..." 
                  className="pl-10 h-10"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !keyword} className="h-10">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Nicho
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              O algoritmo irá buscar os livros mais lidos sobre o tema, checar o Google Trends, mapear o Reddit e gerar a ideia do SaaS.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Oportunidades */}
      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {initialData.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhuma oportunidade detectada ainda. Use a barra acima para iniciar o radar!
          </div>
        )}

        {initialData.map((item) => (
          <Card key={item.id} className="flex flex-col relative overflow-hidden transition-all hover:shadow-md">
            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={item.viral_opportunity_score >= 80 ? "default" : "secondary"}>
                    Score: {item.viral_opportunity_score}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    {(() => {
                      const s = item.viral_opportunity_score || 0;
                      if (s >= 95) return "🌟🌟🌟🌟🌟🌟 (>5 Estrelas)";
                      if (s >= 80) return "⭐⭐⭐⭐⭐ (5 Estrelas)";
                      if (s >= 60) return "⭐⭐⭐⭐ (4 Estrelas)";
                      if (s >= 40) return "⭐⭐⭐ (3 Estrelas)";
                      if (s >= 20) return "⭐⭐ (2 Estrelas)";
                      return "⭐ (1 Estrela)";
                    })()}
                  </Badge>
                  <Badge variant="outline">{item.country}</Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                  onClick={async () => {
                    const res = await fetch('/api/favorites', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ opportunityId: item.id })
                    });
                    if (res.status === 401) {
                      router.push('/login');
                    } else if (res.ok) {
                      alert('Adicionado aos favoritos!');
                    }
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg line-clamp-1">{item.saas_name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {item.problem_solved}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Trends: {item.trends_growth_monthly}%
                </span>
                <span>Reddit: {item.reddit_mentions} refs</span>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="w-full">Ver Detalhes & Prompts</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl">{item.saas_name}</SheetTitle>
                    <SheetDescription>
                      Oportunidade gerada com base no ebook: <strong className="text-foreground">{item.book_title}</strong>
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6">
                    {/* Startup Details */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-primary">Problema Resolvido</h4>
                      <p className="text-sm text-muted-foreground">{item.problem_solved}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Público-Alvo</h4>
                        <p className="text-sm text-muted-foreground">{item.target_audience}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Diferencial</h4>
                        <p className="text-sm text-muted-foreground">{item.competitive_advantage}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Monetização & Preço</h4>
                        <p className="text-sm text-muted-foreground">{item.monetization_model} ({item.suggested_price})</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Receita Potencial</h4>
                        <p className="text-sm text-muted-foreground text-green-500 font-medium">{item.potential_revenue}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Funcionalidades do MVP (30 Dias)</h4>
                      <p className="text-sm text-muted-foreground">{item.mvp_features}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Tempo: {item.development_time}</Badge>
                        <Badge variant="outline">Dificuldade: {item.implementation_difficulty}</Badge>
                        {(() => {
                          const diff = (item.implementation_difficulty || "").toLowerCase();
                          let cost = { label: "Baixo Custo", class: "text-green-500 border-green-500/30 bg-green-500/10" };
                          if (diff.includes("alta") || diff.includes("high") || diff.includes("difícil")) {
                            cost = { label: "Alto Custo", class: "text-red-500 border-red-500/30 bg-red-500/10" };
                          } else if (diff.includes("média") || diff.includes("media") || diff.includes("medium")) {
                            cost = { label: "Custo Médio", class: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" };
                          }
                          return (
                            <Badge variant="outline" className={cost.class}>💰 {cost.label}</Badge>
                          );
                        })()}
                      </div>
                    </div>

                    <Separator />

                    {/* Prompts Section */}
                    <div>
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Gerador de Prompts
                      </h3>
                      <div className="space-y-4">
                        {/* Lovable Prompt */}
                        {item.prompt_lovable && (
                          <div className="bg-muted p-4 rounded-md relative group">
                            <span className="text-xs font-bold text-primary block mb-2">PROMPT PARA LOVABLE</span>
                            <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap pr-8">
                              {item.prompt_lovable}
                            </p>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(item.prompt_lovable, 'lovable')}
                            >
                              {copiedPrompt === 'lovable' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        )}

                        {/* Bolt Prompt */}
                        {item.prompt_bolt && (
                          <div className="bg-muted p-4 rounded-md relative group">
                            <span className="text-xs font-bold text-primary block mb-2">PROMPT PARA BOLT.NEW</span>
                            <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap pr-8">
                              {item.prompt_bolt}
                            </p>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(item.prompt_bolt, 'bolt')}
                            >
                              {copiedPrompt === 'bolt' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
