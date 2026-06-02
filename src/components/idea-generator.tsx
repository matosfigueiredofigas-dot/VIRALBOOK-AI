"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Users, Target, Cpu, Banknote, Copy, CheckCircle2, Star, Loader2, Zap, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, audiences, problems, technologies, monetizations } from "@/lib/matrices";

export function IdeaGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetStars, setTargetStars] = useState<string>("random");
  const [country, setCountry] = useState<string>("BR");
  
  const [idea, setIdea] = useState({
    audience: "",
    problem: "",
    technology: "",
    monetization: "",
    tier: 0
  });

  const getRandom = (arr: Item[], target: string, previousName?: string) => {
    let filtered = arr;
    if (target !== "random") {
      const t = parseInt(target, 10);
      // Pega itens do tier exato OU um tier acima/abaixo para ter mais variedade, mantendo a média.
      filtered = arr.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
      if (filtered.length === 0) filtered = arr;
    }
    
    // Tenta evitar repetir o mesmo item que acabou de sair, se possível
    let pool = filtered.filter(item => item.name !== previousName);
    if (pool.length === 0) pool = filtered; // fallback

    return pool[Math.floor(Math.random() * pool.length)];
  };

  const getStarLabel = (tier: number) => {
    if (tier >= 6) return "🌟🌟🌟🌟🌟🌟 (>5 Estrelas)";
    if (tier === 5) return "⭐⭐⭐⭐⭐ (5 Estrelas)";
    if (tier === 4) return "⭐⭐⭐⭐ (4 Estrelas)";
    if (tier === 3) return "⭐⭐⭐ (3 Estrelas)";
    if (tier === 2) return "⭐⭐ (2 Estrelas)";
    if (tier <= 1) return "⭐ (1 Estrela)";
    return "";
  };

  const generateIdea = () => {
    setIsGenerating(true);
    
    let iterations = 0;
    const interval = setInterval(() => {
      const tA = getRandom(audiences, targetStars, idea.audience);
      const tP = getRandom(problems, targetStars, idea.problem);
      const tT = getRandom(technologies, targetStars, idea.technology);
      const tM = getRandom(monetizations, targetStars, idea.monetization);
      
      const avgTier = Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4);

      setIdea({
        audience: tA.name,
        problem: tP.name,
        technology: tT.name,
        monetization: tM.name,
        tier: targetStars !== "random" ? parseInt(targetStars, 10) : avgTier
      });
      
      iterations++;
      if (iterations > 15) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 50);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const tA = getRandom(audiences, targetStars);
      const tP = getRandom(problems, targetStars);
      const tT = getRandom(technologies, targetStars);
      const tM = getRandom(monetizations, targetStars);
      setIdea({
        audience: tA.name,
        problem: tP.name,
        technology: tT.name,
        monetization: tM.name,
        tier: Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4)
      });
    }, 10);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    const text = `SaaS B2B para ${idea.audience} resolvendo ${idea.problem} com ${idea.technology}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const text = `SaaS B2B para ${idea.audience} focado em resolver problemas de ${idea.problem} utilizando ${idea.technology} e monetizado via ${idea.monetization}`;
      const response = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: text, country }), 
      });

      if (response.ok) {
        // Limpar o cache do Next.js e forçar o redirecionamento com o país correto
        router.refresh();
        window.location.href = `/dashboard?country=${country}`;
      } else {
        alert("Erro ao analisar nicho. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao analisar nicho.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Controles de Geração */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
          {/* Seletor de Qualidade (Estrelas) */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Star className="h-5 w-5 text-yellow-500 ml-2 shrink-0" />
            <Select value={targetStars} onValueChange={setTargetStars}>
              <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                <SelectValue placeholder="Nível da Ideia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Qualquer Nível</SelectItem>
                <SelectItem value="6">&gt;5 Estrelas (Oceano Azul)</SelectItem>
                <SelectItem value="5">5 Estrelas (Inovador)</SelectItem>
                <SelectItem value="4">4 Estrelas (Avançado)</SelectItem>
                <SelectItem value="3">3 Estrelas (Mediano)</SelectItem>
                <SelectItem value="2">2 Estrelas (Comum)</SelectItem>
                <SelectItem value="1">1 Estrela (Saturado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de País */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Globe className="h-5 w-5 text-blue-500 ml-2 shrink-0" />
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                <SelectValue placeholder="País Alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BR">🇧🇷 Brasil (BR)</SelectItem>
                <SelectItem value="US">🇺🇸 Estados Unidos (US)</SelectItem>
                <SelectItem value="PT">🇵🇹 Portugal (PT)</SelectItem>
                <SelectItem value="GB">🇬🇧 Reino Unido (GB)</SelectItem>
                <SelectItem value="CA">🇨🇦 Canadá (CA)</SelectItem>
                <SelectItem value="AU">🇦🇺 Austrália (AU)</SelectItem>
                <SelectItem value="DE">🇩🇪 Alemanha (DE)</SelectItem>
                <SelectItem value="FR">🇫🇷 França (FR)</SelectItem>
                <SelectItem value="ES">🇪🇸 Espanha (ES)</SelectItem>
                <SelectItem value="IN">🇮🇳 Índia (IN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={generateIdea} 
          disabled={isGenerating}
          className={cn(
            "h-16 px-12 text-lg font-bold rounded-full transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105",
            isGenerating && "animate-pulse"
          )}
        >
          <Shuffle className={cn("mr-3 h-6 w-6", isGenerating && "animate-spin")} />
          {isGenerating ? "Combinando Matrizes..." : "Gerar Nova Oportunidade"}
        </Button>
      </div>

      {/* Cartões de Resultados */}
      <div className="grid md:grid-cols-2 gap-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full" />
        
        {/* Público Alvo */}
        <Card className="glass-card border-purple-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Público-Alvo</h3>
            </div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {idea.audience || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Problema */}
        <Card className="glass-card border-red-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-red-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <Target className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Problema / Dor</h3>
            </div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {idea.problem || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Tecnologia */}
        <Card className="glass-card border-blue-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <Cpu className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Tecnologia</h3>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {idea.technology || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Monetização */}
        <Card className="glass-card border-green-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <Banknote className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Monetização</h3>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {idea.monetization || "..."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resultado Consolidado */}
      <div className="mt-8">
        <Card className="bg-background/40 backdrop-blur-md border border-white/10 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Resumo do Nicho</h4>
                {idea.tier > 0 && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-sm py-1">
                    {getStarLabel(idea.tier)}
                  </Badge>
                )}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                Um SaaS B2B para <span className="text-purple-400 font-bold underline decoration-purple-500/30 underline-offset-4">{idea.audience}</span> focado em resolver problemas de <span className="text-red-400 font-bold underline decoration-red-500/30 underline-offset-4">{idea.problem}</span> utilizando <span className="text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-4">{idea.technology}</span> e monetizado via <span className="text-green-400 font-bold underline decoration-green-500/30 underline-offset-4">{idea.monetization}</span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-xl border-white/10 hover:bg-white/5"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-green-500 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5 text-muted-foreground" />
                    Copiar Ideia
                  </>
                )}
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isGenerating}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando e Criando SaaS...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5 text-yellow-300 fill-yellow-300" />
                    Analisar Nicho no Radar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas */}
      <div className="text-center text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs text-muted-foreground">Matemática</Badge>
        {audiences.length * problems.length * technologies.length * monetizations.length} combinações únicas possíveis.
      </div>
    </div>
  );
}
