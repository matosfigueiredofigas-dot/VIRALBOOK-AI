"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Users, Copy, CheckCircle2, Star, Loader2, Zap, Globe, Bookmark, Trash2, Calendar, Dna, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, audiences, technologies } from "@/lib/matrices";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/language-context";

export function IdeaGenerator() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetStars, setTargetStars] = useState<string>("random");
  const [country, setCountry] = useState<string>("ALL");
  const [displayAudience, setDisplayAudience] = useState<string>("");
  
  // Pool local com fallback para dados estáticos
  const [audiencesPool, setAudiencesPool] = useState<Item[]>(audiences);
  
  interface Draft {
    id: string;
    audience: string;
    tier: number;
    created_at: string;
  }

  const [idea, setIdea] = useState({
    audience: "",
    tier: 0
  });

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);

  const [combinationMode, setCombinationMode] = useState<"single" | "crossover">("single");
  const [crossoverType, setCrossoverType] = useState<"2-audiences" | "audience-tech">("2-audiences");
  const [crossoverQuality, setCrossoverQuality] = useState<string>("premium");
  const [crossoverSuggestions, setCrossoverSuggestions] = useState<{ id: string; name: string; tier: number }[]>([]);
  const [analyzingSuggestionId, setAnalyzingSuggestionId] = useState<string | null>(null);

  const [technologiesPool, setTechnologiesPool] = useState<Item[]>(technologies);

  // Estados de controle para ajuste fino do crossover manual
  const [crossoverAudience1, setCrossoverAudience1] = useState<string>("");
  const [crossoverTarget2, setCrossoverTarget2] = useState<string>("");

  const generateCombination = (audiencesList: Item[], techsList: Item[], type: "2-audiences" | "audience-tech", filter: string) => {
    let filteredAudiences = audiencesList;
    let filteredTechs = techsList;
    
    if (filter === "premium") {
      filteredAudiences = audiencesList.filter(item => item.tier >= 4);
      filteredTechs = techsList.filter(item => item.tier >= 4);
    }
    
    if (filteredAudiences.length === 0) filteredAudiences = audiencesList;
    if (filteredTechs.length === 0) filteredTechs = techsList;

    if (type === "2-audiences") {
      const selected: Item[] = [];
      const tempPool = [...filteredAudiences];
      for (let i = 0; i < 2; i++) {
        if (tempPool.length === 0) break;
        const idx = Math.floor(Math.random() * tempPool.length);
        selected.push(tempPool.splice(idx, 1)[0]);
      }
      const combinedName = selected.map(item => item.name).join(" + ");
      const avgTier = selected.length > 0 
        ? Math.round(selected.reduce((acc, curr) => acc + curr.tier, 0) / selected.length)
        : 4;
      return { name: combinedName, tier: avgTier };
    } else {
      const audience = filteredAudiences[Math.floor(Math.random() * filteredAudiences.length)];
      const tech = filteredTechs[Math.floor(Math.random() * filteredTechs.length)];
      const combinedName = `${audience.name} + ${tech.name}`;
      const avgTier = Math.round((audience.tier + tech.tier) / 2);
      return { name: combinedName, tier: avgTier };
    }
  };

  const generateSuggestions = (audiencesList: Item[], techsList: Item[], count: number = 5, type: "2-audiences" | "audience-tech" = "2-audiences", quality: string = "premium") => {
    const suggestions = [
      { id: "s1", name: "Estudantes + dificuldade em estudar + passar em exames", tier: 6 },
      { id: "s2", name: "Desempregados + falta de experiência + encontrar emprego", tier: 6 },
      { id: "s3", name: "Programadores + dificuldade em usar IA + aprender IA", tier: 6 },
      { id: "s4", name: "Comerciantes + gestão financeira + aumentar lucro", tier: 6 },
      { id: "s5", name: "Criadores de conteúdo + pouca visibilidade + viralizar conteúdo", tier: 6 },
      { id: "s6", name: "Agricultores + falta de previsões + melhorar produtividade", tier: 5 },
      { id: "s7", name: "Mototaxistas + desorganização financeira + poupar dinheiro", tier: 4 }
    ];
    
    // Fill the rest with random combinations up to count
    while (suggestions.length < count + 7) {
      const comb = generateCombination(audiencesList, techsList, type, quality);
      // Avoid adding duplicates of the predefined ones
      const alreadyExists = suggestions.some(s => s.name.toLowerCase() === comb.name.toLowerCase());
      if (!alreadyExists) {
        suggestions.push({
          id: Math.random().toString(36).substring(2, 9),
          name: comb.name,
          tier: comb.tier
        });
      }
    }
    
    setCrossoverSuggestions(suggestions);
  };

  const handleReshuffleSuggestions = () => {
    generateSuggestions(audiencesPool, technologiesPool, 5, crossoverType, crossoverQuality);
  };

  const handleAnalyzeSuggestion = async (suggestion: { name: string; tier: number }, id: string) => {
    setAnalyzingSuggestionId(id);
    try {
      const response = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: suggestion.name, country, tier: suggestion.tier, targetLanguage: language }), 
      });

      if (response.ok) {
        router.refresh();
        alert(`Sucesso! SaaS criado a partir de: "${suggestion.name}".`);
        window.location.href = `/dashboard?country=${country}&time=now`;
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Erro ao analisar nicho.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao analisar.");
    } finally {
      setAnalyzingSuggestionId(null);
    }
  };

  const handleDraftSuggestion = (suggestion: { name: string; tier: number }) => {
    const alreadyExists = drafts.some(d => d.audience.toLowerCase() === suggestion.name.toLowerCase());
    if (alreadyExists) {
      alert("Este rascunho já está salvo!");
      return;
    }

    const newDraft: Draft = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      audience: suggestion.name,
      tier: suggestion.tier,
      created_at: new Date().toISOString()
    };

    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem("viralbook_audience_drafts", JSON.stringify(updated));
    alert("Rascunho salvo!");
  };

  const handleLoadSuggestion = (suggestion: { name: string; tier: number }) => {
    setIdea({
      audience: suggestion.name,
      tier: suggestion.tier
    });
    
    // Divide o nome combinado para atualizar os seletores do crossover manual
    if (suggestion.name.includes(" + ")) {
      const parts = suggestion.name.split(" + ");
      if (parts.length >= 2) {
        setCrossoverAudience1(parts[0]);
        setCrossoverTarget2(parts[1]);
        
        const isTech = technologiesPool.some(t => t.name === parts[1]);
        if (isTech) {
          setCrossoverType("audience-tech");
        } else {
          setCrossoverType("2-audiences");
        }
      }
    }

    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const getRandom = (arr: Item[], target: string, previousName?: string) => {
    let filtered = arr;
    if (target !== "random") {
      const t = parseInt(target, 10);
      filtered = arr.filter(item => item.tier === t);
      if (filtered.length === 0) {
        filtered = arr.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
      }
      if (filtered.length === 0) filtered = arr;
    }
    
    let pool = filtered.filter(item => item.name !== previousName);
    if (pool.length === 0) pool = filtered;

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
    
    let filteredAuds = audiencesPool;
    let filteredTechs = technologiesPool;
    if (combinationMode === "crossover" && crossoverQuality === "premium") {
      filteredAuds = audiencesPool.filter(item => item.tier >= 4);
      filteredTechs = technologiesPool.filter(item => item.tier >= 4);
    }
    if (filteredAuds.length === 0) filteredAuds = audiencesPool;
    if (filteredTechs.length === 0) filteredTechs = technologiesPool;

    let iterations = 0;
    const interval = setInterval(() => {
      if (combinationMode === "single") {
        const tA = getRandom(audiencesPool, targetStars, idea.audience);
        setIdea({
          audience: tA.name,
          tier: targetStars !== "random" ? parseInt(targetStars, 10) : tA.tier
        });
      } else {
        if (crossoverType === "2-audiences") {
          const idx1 = Math.floor(Math.random() * filteredAuds.length);
          let idx2 = Math.floor(Math.random() * filteredAuds.length);
          if (idx1 === idx2 && filteredAuds.length > 1) {
            idx2 = (idx2 + 1) % filteredAuds.length;
          }
          const aud1 = filteredAuds[idx1].name;
          const aud2 = filteredAuds[idx2].name;
          setCrossoverAudience1(aud1);
          setCrossoverTarget2(aud2);
          const avgTier = Math.round((filteredAuds[idx1].tier + filteredAuds[idx2].tier) / 2);
          setIdea({
            audience: `${aud1} + ${aud2}`,
            tier: avgTier
          });
        } else {
          const aud = filteredAuds[Math.floor(Math.random() * filteredAuds.length)];
          const tech = filteredTechs[Math.floor(Math.random() * filteredTechs.length)];
          setCrossoverAudience1(aud.name);
          setCrossoverTarget2(tech.name);
          const avgTier = Math.round((aud.tier + tech.tier) / 2);
          setIdea({
            audience: `${aud.name} + ${tech.name}`,
            tier: avgTier
          });
        }
      }
      
      iterations++;
      if (iterations > 15) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 50);
  };

  useEffect(() => {
    async function init() {
      let currentAudiences = audiences;
      let currentTechs = technologies;

      try {
        const { data, error } = await supabase
          .from('matrix_items')
          .select('type, name, tier')
          .eq('type', 'audience');
          
        if (!error && data && data.length > 0) {
          const dbAudiences = data.map((item: any) => ({ name: item.name, tier: item.tier }));

          if (dbAudiences.length > 0) {
            setAudiencesPool(dbAudiences);
            currentAudiences = dbAudiences;
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar matrizes do banco, usando fallback local:", err);
      }

      try {
        const { data: techData, error: techError } = await supabase
          .from('matrix_items')
          .select('type, name, tier')
          .eq('type', 'technology');
          
        if (!techError && techData && techData.length > 0) {
          const dbTech = techData.map((item: any) => ({ name: item.name, tier: item.tier }));
          if (dbTech.length > 0) {
            setTechnologiesPool(dbTech);
            currentTechs = dbTech;
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar tecnologias do banco:", err);
      }

      // Sorteia ideia inicial com os pools carregados
      const tA = getRandom(currentAudiences, targetStars);
      setIdea({
        audience: tA.name,
        tier: targetStars !== "random" ? parseInt(targetStars, 10) : tA.tier
      });

      // Inicializa os seletores de crossover com valores padrão válidos (ordenados alfabeticamente ou os primeiros)
      const sortedAuds = [...currentAudiences].sort((a, b) => a.name.localeCompare(b.name));
      const sortedTechs = [...currentTechs].sort((a, b) => a.name.localeCompare(b.name));
      if (sortedAuds.length > 0) {
        setCrossoverAudience1(sortedAuds[0].name);
        setCrossoverTarget2(sortedAuds[1] ? sortedAuds[1].name : sortedAuds[0].name);
      } else {
        setCrossoverAudience1("");
        setCrossoverTarget2("");
      }

      // Inicializa sugestões do crossover lab
      generateSuggestions(currentAudiences, currentTechs, 5, "2-audiences", "premium");
    }

    init();
    
    const localDrafts = localStorage.getItem("viralbook_audience_drafts");
    if (localDrafts) {
      try {
        setDrafts(JSON.parse(localDrafts));
      } catch (e) {
        console.error("Erro ao carregar rascunhos do localStorage:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!idea.audience) {
      setDisplayAudience("");
      return;
    }

    if (language === 'pt') {
      setDisplayAudience(idea.audience);
      return;
    }

    const cacheKey = `vbook_aud_trans_${language}_${idea.audience}`;
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem(cacheKey) : null;
    if (cached) {
      setDisplayAudience(cached);
      return;
    }

    setDisplayAudience(idea.audience); // Fallback imediato

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: 'audience', saas_name: idea.audience }],
        targetLanguage: language
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.translatedItems && data.translatedItems[0]?.saas_name) {
          const trans = data.translatedItems[0].saas_name;
          setDisplayAudience(trans);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(cacheKey, trans);
          }
        }
      })
      .catch(err => console.error('[Audience Translate Error]:', err));
  }, [idea.audience, language]);

  const handleSaveDraft = () => {
    if (!idea.audience) return;
    
    const alreadyExists = drafts.some(d => d.audience.toLowerCase() === idea.audience.toLowerCase());
    if (alreadyExists) {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
      return;
    }

    const newDraft: Draft = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      audience: idea.audience,
      tier: idea.tier,
      created_at: new Date().toISOString()
    };

    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem("viralbook_audience_drafts", JSON.stringify(updated));
    
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleLoadDraft = (draft: Draft) => {
    setIdea({
      audience: draft.audience,
      tier: draft.tier
    });

    if (draft.audience.includes(" + ")) {
      setCombinationMode("crossover");
      const parts = draft.audience.split(" + ");
      if (parts.length >= 2) {
        setCrossoverAudience1(parts[0]);
        setCrossoverTarget2(parts[1]);

        const isTech = technologiesPool.some(t => t.name === parts[1]);
        if (isTech) {
          setCrossoverType("audience-tech");
        } else {
          setCrossoverType("2-audiences");
        }
      }
    } else {
      setCombinationMode("single");
    }

    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("viralbook_audience_drafts", JSON.stringify(updated));
  };

  const handleTargetStarsChange = (value: string | null) => {
    setTargetStars(value || "random");
  };

  const handleCrossoverQualityChange = (value: string | null) => {
    const qual = value || "premium";
    setCrossoverQuality(qual);
    
    let filteredAuds = audiencesPool;
    let filteredTechs = technologiesPool;
    if (qual === "premium") {
      filteredAuds = audiencesPool.filter(item => item.tier >= 4);
      filteredTechs = technologiesPool.filter(item => item.tier >= 4);
    }
    if (filteredAuds.length === 0) filteredAuds = audiencesPool;
    if (filteredTechs.length === 0) filteredTechs = technologiesPool;
    
    const sortedAuds = [...filteredAuds].sort((a, b) => a.name.localeCompare(b.name));
    const sortedTechs = [...filteredTechs].sort((a, b) => a.name.localeCompare(b.name));
    
    let newAud1 = crossoverAudience1;
    let newTarget2 = crossoverTarget2;
    
    if (!filteredAuds.some(a => a.name === crossoverAudience1)) {
      newAud1 = sortedAuds[0]?.name || "";
      setCrossoverAudience1(newAud1);
    }
    
    if (crossoverType === "2-audiences") {
      if (!filteredAuds.some(a => a.name === crossoverTarget2) || crossoverTarget2 === newAud1) {
        newTarget2 = sortedAuds.find(a => a.name !== newAud1)?.name || sortedAuds[0]?.name || "";
        setCrossoverTarget2(newTarget2);
      }
    } else {
      if (!filteredTechs.some(t => t.name === crossoverTarget2)) {
        newTarget2 = sortedTechs[0]?.name || "";
        setCrossoverTarget2(newTarget2);
      }
    }
    
    const item1 = audiencesPool.find(x => x.name === newAud1);
    let avgTier = 4;
    if (crossoverType === "2-audiences") {
      const item2 = audiencesPool.find(x => x.name === newTarget2);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
    } else {
      const item2 = technologiesPool.find(x => x.name === newTarget2);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
    }
    setIdea({
      audience: `${newAud1} + ${newTarget2}`,
      tier: avgTier
    });

    generateSuggestions(audiencesPool, technologiesPool, 5, crossoverType, qual);
  };

  const handleCrossoverTypeChange = (value: string | null) => {
    const type = (value || "2-audiences") as "2-audiences" | "audience-tech";
    setCrossoverType(type);
    
    if (type === "2-audiences") {
      const sortedAuds = [...audiencesPool]
        .filter(a => a.name !== crossoverAudience1)
        .sort((a, b) => a.name.localeCompare(b.name));
      const firstAud = sortedAuds[0]?.name || "";
      setCrossoverTarget2(firstAud);
      
      const combName = `${crossoverAudience1 || audiencesPool[0]?.name} + ${firstAud}`;
      const item1 = audiencesPool.find(x => x.name === crossoverAudience1);
      const item2 = audiencesPool.find(x => x.name === firstAud);
      const avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      setIdea({ audience: combName, tier: avgTier });
    } else {
      const sortedTechs = [...technologiesPool].sort((a, b) => a.name.localeCompare(b.name));
      const firstTech = sortedTechs[0]?.name || "";
      setCrossoverTarget2(firstTech);
      
      const combName = `${crossoverAudience1 || audiencesPool[0]?.name} + ${firstTech}`;
      const item1 = audiencesPool.find(x => x.name === crossoverAudience1);
      const item2 = technologiesPool.find(x => x.name === firstTech);
      const avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      setIdea({ audience: combName, tier: avgTier });
    }

    generateSuggestions(audiencesPool, technologiesPool, 5, type, crossoverQuality);
  };

  const handleCrossoverAudience1Change = (val: string | null) => {
    const stringVal = val || "";
    setCrossoverAudience1(stringVal);
    const item1 = audiencesPool.find(x => x.name === stringVal);
    let avgTier = 4;
    let combName = "";
    if (crossoverType === "2-audiences") {
      const item2 = audiencesPool.find(x => x.name === crossoverTarget2);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      combName = `${stringVal} + ${crossoverTarget2}`;
    } else {
      const item2 = technologiesPool.find(x => x.name === crossoverTarget2);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      combName = `${stringVal} + ${crossoverTarget2}`;
    }
    setIdea({ audience: combName, tier: avgTier });
  };

  const handleCrossoverTarget2Change = (val: string | null) => {
    const stringVal = val || "";
    setCrossoverTarget2(stringVal);
    const item1 = audiencesPool.find(x => x.name === crossoverAudience1);
    let avgTier = 4;
    let combName = "";
    if (crossoverType === "2-audiences") {
      const item2 = audiencesPool.find(x => x.name === stringVal);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      combName = `${crossoverAudience1} + ${stringVal}`;
    } else {
      const item2 = technologiesPool.find(x => x.name === stringVal);
      avgTier = Math.round(((item1?.tier || 4) + (item2?.tier || 4)) / 2);
      combName = `${crossoverAudience1} + ${stringVal}`;
    }
    setIdea({ audience: combName, tier: avgTier });
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value || "ALL");
  };

  const handleCopy = () => {
    const text = `Público-Alvo: ${idea.audience}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: idea.audience, country, tier: idea.tier, targetLanguage: language }), 
      });

      if (response.ok) {
        // Limpar o cache do Next.js e forçar o redirecionamento com o país correto
        router.refresh();
        window.location.href = `/dashboard?country=${country}`;
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Erro ao analisar nicho. Tente novamente.");
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
          {audiencesPool.length.toLocaleString()} {t.generator.availableNiches}
        </span>
        <p className="text-xxs text-muted-foreground/75 font-medium mt-1">
          {t.generator.nicheSubtitle}
        </p>
      </div>

      {/* Alternador de Modo de Geração */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-muted/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg">
          <button
            onClick={() => setCombinationMode("single")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer",
              combinationMode === "single"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-3.5 w-3.5" />
            {t.generator.singleNiche}
          </button>
          
          <button
            onClick={() => setCombinationMode("crossover")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer",
              combinationMode === "crossover"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20 scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Dna className="h-3.5 w-3.5 animate-pulse" />
            {t.generator.crossoverNiche}
          </button>
        </div>
      </div>

      {/* Controles de Geração */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
          {combinationMode === "single" ? (
            <>
              {/* Seletor de Qualidade (Estrelas) */}
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
                <Star className="h-5 w-5 text-yellow-500 ml-2 shrink-0" />
                <Select value={targetStars} onValueChange={handleTargetStarsChange}>
                  <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                    <SelectValue placeholder={isEn ? "Idea Tier" : isEs ? "Nivel de Idea" : "Nível da Ideia"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">{isEn ? "Any Tier" : isEs ? "Cualquier Nivel" : "Qualquer Nível"}</SelectItem>
                    <SelectItem value="6">{isEn ? ">5 Stars (Blue Ocean)" : isEs ? ">5 Estrellas (Océano Azul)" : ">5 Estrelas (Oceano Azul)"}</SelectItem>
                    <SelectItem value="5">{isEn ? "5 Stars (Innovative)" : isEs ? "5 Estrellas (Innovador)" : "5 Estrelas (Inovador)"}</SelectItem>
                    <SelectItem value="4">{isEn ? "4 Stars (Advanced)" : isEs ? "4 Estrellas (Avanzado)" : "4 Estrelas (Avançado)"}</SelectItem>
                    <SelectItem value="3">{isEn ? "3 Stars (Average)" : isEs ? "3 Estrellas (Mediano)" : "3 Estrelas (Mediano)"}</SelectItem>
                    <SelectItem value="2">{isEn ? "2 Stars (Common)" : isEs ? "2 Estrellas (Común)" : "2 Estrelas (Comum)"}</SelectItem>
                    <SelectItem value="1">{isEn ? "1 Star (Saturated)" : isEs ? "1 Estrella (Saturado)" : "1 Estrela (Saturado)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Tipo de Crossover */}
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
                <Plus className="h-5 w-5 text-purple-400 ml-2 shrink-0" />
                <Select value={crossoverType} onValueChange={handleCrossoverTypeChange}>
                  <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                    <SelectValue placeholder={isEn ? "Crossover Type" : isEs ? "Tipo de Crossover" : "Tipo de Crossover"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-audiences">{isEn ? "2 Audiences Crossover" : isEs ? "Crossover de 2 Públicos" : "Crossover de 2 Públicos"}</SelectItem>
                    <SelectItem value="audience-tech">{isEn ? "Niche + Premium Tech" : isEs ? "Nicho + Tecnología Premium" : "Nicho + Tecnologia Premium"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Qualidade do Crossover */}
              <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
                <Star className="h-5 w-5 text-purple-400 ml-2 shrink-0" />
                <Select value={crossoverQuality} onValueChange={handleCrossoverQualityChange}>
                  <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                    <SelectValue placeholder={isEn ? "Quality" : isEs ? "Calidad" : "Qualidade"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">{isEn ? "Premium (4, 5 & >5★)" : isEs ? "Premium (4, 5 y >5★)" : "Premium (4, 5 e >5★)"}</SelectItem>
                    <SelectItem value="random">{isEn ? "Any Tier" : isEs ? "Cualquier Nivel" : "Qualquer Nível"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Seletor de País */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Globe className="h-5 w-5 text-blue-500 ml-2 shrink-0" />
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                <SelectValue placeholder={isEn ? "Target Country" : isEs ? "País Objetivo" : "País Alvo"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">🌐 {isEn ? "ALL COUNTRIES" : isEs ? "TODOS LOS PAÍSES" : "TODOS PAÍSES"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      {/* Seletores de Customização de Crossover Manual */}
      {combinationMode === "crossover" && (
        <div className="bg-purple-950/15 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-md shadow-lg w-full max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Dna className="h-4 w-4 text-purple-400 animate-pulse" />
              {t.generator.manualCrossoverTitle}
            </h4>
            <span className="text-xxs text-muted-foreground/75">
              {t.generator.manualCrossoverSub}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primeiro Termo: Sempre Público 1 */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{t.generator.mainAudience}</label>
              <div className="flex items-center gap-2 bg-muted/40 border border-white/5 rounded-xl px-3 py-1.5 focus-within:border-purple-500/50 transition-all">
                <Users className="h-4 w-4 text-purple-400 shrink-0" />
                <Select value={crossoverAudience1} onValueChange={handleCrossoverAudience1Change}>
                  <SelectTrigger className="border-0 bg-transparent text-sm focus:ring-0 w-full p-0 h-8 text-foreground font-medium">
                    <SelectValue placeholder={t.generator.mainAudience} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-xl border border-white/10">
                    {[...audiencesPool]
                      .filter(item => crossoverQuality !== "premium" || item.tier >= 4)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((aud) => (
                        <SelectItem key={aud.name} value={aud.name} className="text-xs">
                          {aud.name} (★{aud.tier})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Segundo Termo: Público 2 ou Tecnologia */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                {crossoverType === "2-audiences" ? t.generator.secondAudience : t.generator.techTrigger}
              </label>
              <div className="flex items-center gap-2 bg-muted/40 border border-white/5 rounded-xl px-3 py-1.5 focus-within:border-purple-500/50 transition-all">
                {crossoverType === "2-audiences" ? (
                  <Users className="h-4 w-4 text-purple-400 shrink-0" />
                ) : (
                  <Zap className="h-4 w-4 text-purple-400 shrink-0" />
                )}
                
                <Select value={crossoverTarget2} onValueChange={handleCrossoverTarget2Change}>
                  <SelectTrigger className="border-0 bg-transparent text-sm focus:ring-0 w-full p-0 h-8 text-foreground font-medium">
                    <SelectValue placeholder={crossoverType === "2-audiences" ? "Selecione o Público 2" : "Selecione a Tecnologia"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background/95 backdrop-blur-xl border border-white/10">
                    {crossoverType === "2-audiences"
                      ? [...audiencesPool]
                          .filter(item => crossoverQuality !== "premium" || item.tier >= 4)
                          .filter(a => a.name !== crossoverAudience1)
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((aud) => (
                            <SelectItem key={aud.name} value={aud.name} className="text-xs">
                              {aud.name} (★{aud.tier})
                            </SelectItem>
                          ))
                      : [...technologiesPool]
                          .filter(item => crossoverQuality !== "premium" || item.tier >= 4)
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((tech) => (
                            <SelectItem key={tech.name} value={tech.name} className="text-xs">
                              {tech.name} (★{tech.tier})
                            </SelectItem>
                          ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button 
        size="lg" 
        onClick={generateIdea} 
        disabled={isGenerating}
        className={cn(
          "h-16 px-12 text-lg font-bold rounded-full transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 cursor-pointer",
          isGenerating && "animate-pulse"
        )}
      >
        <Shuffle className={cn("mr-3 h-6 w-6", isGenerating && "animate-spin")} />
          {isGenerating 
            ? t.generator.generating
            : t.generator.generateRandom}
        </Button>
      </div>

      {/* Cartão Central de Resultado */}
      <div className="flex justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full" />
        
        {/* Público Alvo */}
        <Card className="glass-card border-purple-500/30 overflow-hidden relative group w-full max-w-2xl shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-500 group-hover:bg-purple-500/20" />
          <CardContent className="p-8 md:p-12 relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center gap-2.5 text-purple-400">
              <Users className="h-6 w-6" />
              <h3 className="font-extrabold uppercase tracking-widest text-sm">{t.generator.selectedAudience}</h3>
            </div>
            <p className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent drop-shadow-sm min-h-[3rem] flex items-center justify-center">
              {displayAudience || idea.audience || "..."}
            </p>
            {idea.tier > 0 && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs py-1 font-bold">
                {getStarLabel(idea.tier)}
              </Badge>
            )}
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
                <h4 className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{t.generator.nicheSummary}</h4>
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                <span className="text-purple-400 font-bold underline decoration-purple-500/30 underline-offset-4">{displayAudience || idea.audience}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-xl border-purple-500/20 hover:bg-purple-500/10 text-purple-400 font-semibold cursor-pointer"
                onClick={handleSaveDraft}
                disabled={!idea.audience}
              >
                {draftSaved ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5 text-purple-400" />
                    {t.generator.draftSaved}
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-2 h-5 w-5 text-purple-400" />
                    {t.generator.saveDraft}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-xl border-white/10 hover:bg-white/5 cursor-pointer"
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
                    Copiar
                  </>
                )}
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20 cursor-pointer"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isGenerating}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.generator.analyzing}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5 text-yellow-300 fill-yellow-300" />
                    {t.generator.analyzeNiche}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rascunhos de Públicos-Alvo Salvos */}
      {drafts.length > 0 && (
        <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2">
            <Bookmark className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-foreground">Meus Rascunhos ({drafts.length})</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {drafts.map((d) => (
              <Card key={d.id} className="bg-card/30 backdrop-blur-md border border-white/5 hover:border-purple-500/20 transition-all duration-300 relative group overflow-hidden">
                <CardContent className="p-5 flex items-center justify-between gap-4 z-10 relative">
                  <div className="flex-1 space-y-1.5 cursor-pointer" onClick={() => handleLoadDraft(d)}>
                    <p className="font-bold text-foreground group-hover:text-purple-400 transition-colors text-base line-clamp-1">{d.audience}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xxs text-muted-foreground/80 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(d.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      {d.tier > 0 && (
                        <span className="inline-flex items-center text-[10px] text-yellow-500 font-medium">
                          ★ {d.tier}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-purple-400 hover:bg-purple-500/10"
                      onClick={() => handleLoadDraft(d)}
                      title="Carregar no Gerador"
                    >
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => handleDeleteDraft(d.id)}
                      title="Excluir Rascunho"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="text-center text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs text-muted-foreground">Base de Dados</Badge>
        {audiencesPool.length} públicos-alvo qualificados cadastrados.
      </div>
    </div>
  );
}
