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
import { supabase } from "@/lib/supabase";

export function IdeaGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetStars, setTargetStars] = useState<string>("random");
  const [country, setCountry] = useState<string>("BR");
  
  // Pools locais com fallback para dados estáticos
  const [audiencesPool, setAudiencesPool] = useState<Item[]>(audiences);
  const [problemsPool, setProblemsPool] = useState<Item[]>(problems);
  const [technologiesPool, setTechnologiesPool] = useState<Item[]>(technologies);
  const [monetizationsPool, setMonetizationsPool] = useState<Item[]>(monetizations);
  
  // Histórico de itens gerados recentemente para evitar repetições
  const [usedAudiences, setUsedAudiences] = useState<string[]>([]);
  const [usedProblems, setUsedProblems] = useState<string[]>([]);
  const [usedTechnologies, setUsedTechnologies] = useState<string[]>([]);
  const [usedMonetizations, setUsedMonetizations] = useState<string[]>([]);

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
      filtered = arr.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
      if (filtered.length === 0) filtered = arr;
    }
    
    let pool = filtered.filter(item => item.name !== previousName);
    if (pool.length === 0) pool = filtered;

    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Algoritmo de seleção exclusiva de combinação única
  const getUniqueCombination = () => {
    const pickUnique = (pool: Item[], used: string[], target: string) => {
      let filtered = pool;
      if (target !== "random") {
        const t = parseInt(target, 10);
        filtered = pool.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
        if (filtered.length === 0) filtered = pool;
      }

      // Filtrar candidatos não utilizados recentemente
      let candidates = filtered.filter(item => !used.includes(item.name));
      let nextUsed = [...used];

      if (candidates.length === 0) {
        // Pool exaurido, reinicia o histórico
        candidates = filtered;
        nextUsed = [];
      }

      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      
      // Limita o histórico a 70% do tamanho do pool filtrado para evitar travamento
      const maxHistory = Math.max(5, Math.floor(filtered.length * 0.7));
      nextUsed.push(selected.name);
      if (nextUsed.length > maxHistory) {
        nextUsed.shift();
      }

      return { selected, nextUsed };
    };

    const { selected: tA, nextUsed: nextAudiences } = pickUnique(audiencesPool, usedAudiences, targetStars);
    const { selected: tP, nextUsed: nextProblems } = pickUnique(problemsPool, usedProblems, targetStars);
    const { selected: tT, nextUsed: nextTechs } = pickUnique(technologiesPool, usedTechnologies, targetStars);
    const { selected: tM, nextUsed: nextMonetizations } = pickUnique(monetizationsPool, usedMonetizations, targetStars);

    // Salva os novos históricos
    setUsedAudiences(nextAudiences);
    setUsedProblems(nextProblems);
    setUsedTechnologies(nextTechs);
    setUsedMonetizations(nextMonetizations);

    const avgTier = Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4);

    return {
      audience: tA.name,
      problem: tP.name,
      technology: tT.name,
      monetization: tM.name,
      tier: targetStars !== "random" ? parseInt(targetStars, 10) : avgTier
    };
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
    
    // Pré-calcula a ideia final que é garantidamente inédita/não repetida recentemente
    const finalIdea = getUniqueCombination();
    
    let iterations = 0;
    const interval = setInterval(() => {
      // Durante o spin da animação visual, sorteia puramente itens aleatórios para dar dinamismo
      const tA = getRandom(audiencesPool, targetStars, idea.audience);
      const tP = getRandom(problemsPool, targetStars, idea.problem);
      const tT = getRandom(technologiesPool, targetStars, idea.technology);
      const tM = getRandom(monetizationsPool, targetStars, idea.monetization);
      
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
        // Desembarca exatamente na combinação única calculada previamente
        setIdea(finalIdea);
        setIsGenerating(false);
      }
    }, 50);
  };

  useEffect(() => {
    async function init() {
      let currentAudiences = audiences;
      let currentProblems = problems;
      let currentTechnologies = technologies;
      let currentMonetizations = monetizations;

      try {
        const { data, error } = await supabase
          .from('matrix_items')
          .select('type, name, tier');
          
        if (!error && data && data.length > 0) {
          const dbAudiences = data.filter((item: any) => item.type === 'audience').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbProblems = data.filter((item: any) => item.type === 'problem').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbTechnologies = data.filter((item: any) => item.type === 'technology').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbMonetizations = data.filter((item: any) => item.type === 'monetization').map((item: any) => ({ name: item.name, tier: item.tier }));

          if (dbAudiences.length > 0) {
            setAudiencesPool(dbAudiences);
            currentAudiences = dbAudiences;
          }
          if (dbProblems.length > 0) {
            setProblemsPool(dbProblems);
            currentProblems = dbProblems;
          }
          if (dbTechnologies.length > 0) {
            setTechnologiesPool(dbTechnologies);
            currentTechnologies = dbTechnologies;
          }
          if (dbMonetizations.length > 0) {
            setMonetizationsPool(dbMonetizations);
            currentMonetizations = dbMonetizations;
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar matrizes do banco, usando fallback local:", err);
      }

      // Sorteia ideia inicial com os pools carregados
      const tA = getRandom(currentAudiences, targetStars);
      const tP = getRandom(currentProblems, targetStars);
      const tT = getRandom(currentTechnologies, targetStars);
      const tM = getRandom(currentMonetizations, targetStars);
      
      setIdea({
        audience: tA.name,
        problem: tP.name,
        technology: tT.name,
        monetization: tM.name,
        tier: Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4)
      });

      // Registra a ideia inicial no histórico para evitar repetição logo de início
      setUsedAudiences([tA.name]);
      setUsedProblems([tP.name]);
      setUsedTechnologies([tT.name]);
      setUsedMonetizations([tM.name]);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTargetStarsChange = (value: string | null) => {
    setTargetStars(value || "random");
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value || "BR");
  };

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
      {/* Contador de Combinações Premium */}
      <div className="text-center space-y-1 bg-card/25 backdrop-blur-md border border-white/5 py-4 px-6 rounded-2xl max-w-2xl mx-auto shadow-inner flex flex-col items-center justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 shadow-md">
          <Zap className="h-3.5 w-3.5 fill-primary animate-pulse text-primary" />
          {(audiencesPool.length * problemsPool.length * technologiesPool.length * monetizationsPool.length).toLocaleString('pt-BR')} Combinações Únicas de Ideias
        </span>
        <p className="text-xxs text-muted-foreground/75 font-medium mt-1">
          Alimentado por {audiencesPool.length} Públicos-Alvo • {problemsPool.length} Dores/Problemas • {technologiesPool.length} Tecnologias • {monetizationsPool.length} Monetizações
        </p>
      </div>

      {/* Controles de Geração */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
          {/* Seletor de Qualidade (Estrelas) */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Star className="h-5 w-5 text-yellow-500 ml-2 shrink-0" />
            <Select value={targetStars} onValueChange={handleTargetStarsChange}>
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
            <Select value={country} onValueChange={handleCountryChange}>
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
        {audiencesPool.length * problemsPool.length * technologiesPool.length * monetizationsPool.length} combinações únicas possíveis.
      </div>
    </div>
  );
}
