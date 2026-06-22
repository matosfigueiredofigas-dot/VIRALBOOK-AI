"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Target, BookOpen, Lock, CheckCircle2, 
  MessageSquare, Sparkles, TrendingUp, FileText, 
  Check, Play, ArrowLeft, RefreshCw, AlertCircle, Search
} from "lucide-react";

interface ComboItem {
  id: string;
  audience: string;
  problem: string;
  goal: string;
  title: string;
  score: number;
  saturation: string;
  cost: string;
  complexity: string;
  reddit: {
    subreddit: string;
    comment: string;
    sentiment: string;
  };
  googleBooks: {
    title: string;
    rating: string;
    insight: string;
  };
  leanCanvas: {
    problem: string;
    solution: string;
    unfairAdvantage: string;
  };
}

const PRESET_COMBOS: ComboItem[] = [
  {
    id: "combo-1",
    audience: "Estudantes do ensino médio",
    problem: "Dificuldade em estudar",
    goal: "Passar em exames",
    title: "Tutor de Exames Inteligente",
    score: 94,
    saturation: "Baixa (15%)",
    cost: "Baixo (3-5 dias)",
    complexity: "Fácil (No-Code viável)",
    reddit: {
      subreddit: "r/enem",
      comment: "Minha maior dificuldade é organizar o cronograma e saber o que cai mais. Fico perdido em resumos gigantes de apostilas.",
      sentiment: "Frustração com materiais tradicionais"
    },
    googleBooks: {
      title: "Como Estudar para Provas e Concursos",
      rating: "⭐ 4.7 (1.2k+ avaliações)",
      insight: "O público investe significativamente em livros físicos/e-books sobre métodos de estudo, validando a disposição para pagar por soluções."
    },
    leanCanvas: {
      problem: "Falta de foco, excesso de material teórico sem aplicação prática, ansiedade pré-exame e desorganização de cronogramas.",
      solution: "Plataforma de micro-simulados diários ultra-focados baseados nas fraquezas de aprendizado detectadas por IA.",
      unfairAdvantage: "Algoritmo proprietário que cruza os erros do usuário com a recorrência de temas em exames oficiais dos últimos 10 anos."
    }
  },
  {
    id: "combo-2",
    audience: "Desempregados",
    problem: "Falta de experiência",
    goal: "Encontrar emprego",
    title: "Simulador de Entrevistas & Portfólio IA",
    score: 89,
    saturation: "Média (28%)",
    cost: "Médio (5-7 dias)",
    complexity: "Média (Requer APIs de voz)",
    reddit: {
      subreddit: "r/carreiras",
      comment: "As vagas de nível júnior pedem 2 anos de experiência. Como vou conseguir essa experiência inicial se ninguém me dá a chance?",
      sentiment: "Desejo de provar valor sem barreira de currículo"
    },
    googleBooks: {
      title: "O Guia do Primeiro Emprego",
      rating: "⭐ 4.5 (800+ avaliações)",
      insight: "Forte engajamento literário com manuais de preparação e transição de carreira, o que indica um mercado aberto a facilitadores."
    },
    leanCanvas: {
      problem: "Barreiras excessivas em vagas de entrada e nervosismo em entrevistas técnicas presenciais.",
      solution: "Simulador de entrevistas por IA que gera testes realistas em áudio, analisa respostas e constrói um mini-portfólio prático com os resultados.",
      unfairAdvantage: "Geração de relatórios de proficiência técnica compartilháveis em um clique diretamente para recrutadores."
    }
  },
  {
    id: "combo-3",
    audience: "Programadores",
    problem: "Dificuldade em usar IA",
    goal: "Aprender IA",
    title: "Assistente de Prompt Engineering & Arquitetura",
    score: 92,
    saturation: "Média (32%)",
    cost: "Baixo (2-4 dias)",
    complexity: "Fácil (Uso de APIs existentes)",
    reddit: {
      subreddit: "r/brdev",
      comment: "A IA me dá respostas genéricas ou alucina muito quando tento usar para arquiteturas complexas ou refatoração profunda.",
      sentiment: "Necessidade de precisão técnica"
    },
    googleBooks: {
      title: "Programação Prática com Modelos de Linguagem",
      rating: "⭐ 4.6 (600+ avaliações)",
      insight: "Livros técnicos sobre integrações de IA têm alto preço de capa e vendas rápidas, provando que desenvolvedores pagam caro por esse conhecimento."
    },
    leanCanvas: {
      problem: "Prompting inadequado gera código inútil, vazamento de dados confidenciais e retrabalho de refatoração.",
      solution: "Extensão de IDE que mapeia a estrutura do projeto local e gera contexto de prompt blindado e livre de alucinações automaticamente.",
      unfairAdvantage: "Filtros heurísticos locais integrados que testam a sintaxe do código sugerido pela IA antes de exibi-lo ao desenvolvedor."
    }
  },
  {
    id: "combo-4",
    audience: "Pequenos Comerciantes",
    problem: "Gestão financeira complexa",
    goal: "Aumentar lucro",
    title: "Caixa Fácil & Otimizador de Margem",
    score: 95,
    saturation: "Muito Baixa (8%)",
    cost: "Baixo (3-5 dias)",
    complexity: "Fácil (Interface simplificada)",
    reddit: {
      subreddit: "r/empreendedorismo",
      comment: "No fim do mês eu vendo bem, mas não vejo a cor do dinheiro. Misturo conta física e jurídica e não sei a margem real das mercadorias.",
      sentiment: "Falta de controle de fluxo de caixa"
    },
    googleBooks: {
      title: "Finanças para Micro e Pequenas Empresas",
      rating: "⭐ 4.8 (2k+ avaliações)",
      insight: "Best-sellers permanentes mostram que a falta de controle financeiro é a dor número um que leva empresas locais à falência."
    },
    leanCanvas: {
      problem: "Sistemas ERP tradicionais são caros, complexos e exigem computadores. Comerciantes misturam caixa pessoal e comercial.",
      solution: "Assistente financeiro via chat do WhatsApp que registra vendas por áudio, calcula margem líquida e dá avisos diários do lucro.",
      unfairAdvantage: "Motor de parsing de linguagem natural treinado para entender jargões de comerciantes informais de forma ultra-precisa."
    }
  },
  {
    id: "combo-5",
    audience: "Criadores de conteúdo",
    problem: "Pouca visibilidade",
    goal: "Viralizar conteúdo",
    title: "Roteirizador Viral & Copiloto TikTok/Reels",
    score: 91,
    saturation: "Alta (45%)",
    cost: "Baixo (2-3 dias)",
    complexity: "Fácil (Geração de texto)",
    reddit: {
      subreddit: "r/marketingdigital",
      comment: "Fico horas editando um vídeo perfeito, posto e pega 200 views. O algoritmo simplesmente me ignora porque não sei prender atenção.",
      sentiment: "Frustração com o algoritmo e falta de ganchos"
    },
    googleBooks: {
      title: "A Fórmula da Viralização em Redes Sociais",
      rating: "⭐ 4.6 (1.5k+ avaliações)",
      insight: "Mercado gigantesco de infoprodutos e livros sobre crescimento orgânico mostra alta urgência de compra por parte dos criadores."
    },
    leanCanvas: {
      problem: "Vídeos perdem 80% do público nos primeiros 3 segundos por falta de hooks (ganchos) e storytelling cativante.",
      solution: "Gerador de scripts de vídeo com ganchos validados e estrutura psicológica otimizada para reter o público na plataforma.",
      unfairAdvantage: "Biblioteca automatizada alimentada semanalmente com os 1.000 vídeos de maior crescimento orgânico do TikTok."
    }
  }
];

export function ProductSimulator() {
  const [activeTab, setActiveTab] = useState<"combo" | "scanning" | "dashboard">("combo");
  const [selectedCombo, setSelectedCombo] = useState<ComboItem>(PRESET_COMBOS[0]);
  const [customAudience, setCustomAudience] = useState("");
  const [customProblem, setCustomProblem] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  // Animation log variables
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    "🔍 Iniciando radar de validação de mercado...",
    `📡 Analisando conversas e posts recentes no Reddit sobre '${isCustomMode ? customAudience : selectedCombo.audience}'...`,
    "📊 Identificando reclamações recorrentes e nível de frustração emocional...",
    "📚 Consultando base literária do Google Books para mapear virabilidade de compra...",
    "⚡ Calculando estimativa de Custo de Construção e Saturação de mercado...",
    "🧠 Alimentando a inteligência artificial (Groq API) para desenhar o Lean Canvas...",
    "✅ Validação concluída com sucesso! Gerando painel de oportunidades..."
  ];

  // Canvas tabs within dashboard
  const [canvasTab, setCanvasTab] = useState<"problema" | "solucao" | "vantagem">("problema");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === "scanning") {
      setLogIndex(0);
      const interval = setInterval(() => {
        setLogIndex(prev => {
          if (prev < logs.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            timer = setTimeout(() => {
              setActiveTab("dashboard");
            }, 280);
            return prev;
          }
        });
      }, 120);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [activeTab]);

  const handleStartSimulation = () => {
    if (isCustomMode) {
      if (!customAudience || !customProblem || !customGoal) {
        alert("Preencha todos os campos customizados para simular!");
        return;
      }
      
      // Build a dynamic mock combo for the custom selection
      const customCombo: ComboItem = {
        id: "custom-combo",
        audience: customAudience,
        problem: customProblem,
        goal: customGoal,
        title: `SaaS de ${customGoal} para ${customAudience}`,
        score: Math.floor(Math.random() * 15) + 81, // 81-95 score
        saturation: "Baixa (12%)",
        cost: "Médio (4-6 dias)",
        complexity: "Médio",
        reddit: {
          subreddit: `r/${customAudience.toLowerCase().replace(/\s+/g, "")}`,
          comment: `Alguém conhece alguma ferramenta simples que ajude com ${customProblem.toLowerCase()}? Os apps atuais são complexos demais.`,
          sentiment: "Necessidade latente por usabilidade simples"
        },
        googleBooks: {
          title: `Guia de Sucesso para ${customAudience}`,
          rating: "⭐ 4.6 (120+ avaliações)",
          insight: "Público busca guias autodidatas e manuais estruturados, provando que gastam ativamente para otimizar suas atividades."
        },
        leanCanvas: {
          problem: `Dificuldade contínua com ${customProblem.toLowerCase()} e gasto de tempo desnecessário tentando contornar a dor.`,
          solution: `Aplicativo focado exclusivamente em automatizar a dor de ${customProblem.toLowerCase()} com fluxos guiados por IA.`,
          unfairAdvantage: `Interface conversational ou atalhos mobile customizados criados especificamente para a rotina de ${customAudience.toLowerCase()}.`
        }
      };
      
      setSelectedCombo(customCombo);
    }
    setActiveTab("scanning");
  };

  const handleSelectPreset = (combo: ComboItem) => {
    setIsCustomMode(false);
    setSelectedCombo(combo);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-primary/30 to-border/30 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="bg-card/45 backdrop-blur-2xl rounded-[23px] p-6 md:p-8 min-h-[520px] flex flex-col justify-between">
        
        {/* Header da Simulação */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/40 pb-5 mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="h-3 w-3 animate-spin" />
              SIMULAÇÃO INTERATIVA
            </div>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
              Como funciona o Radar de Virabilidade?
            </h3>
          </div>
          
          {activeTab !== "combo" && (
            <button
              onClick={() => setActiveTab("combo")}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/50 bg-background cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" /> Voltar ao Início
            </button>
          )}
        </div>

        {/* Corpo principal com base na Tab ativa */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ETAPA 1: ESCOLHER/CRIAR COMBINAÇÃO */}
            {activeTab === "combo" && (
              <motion.div
                key="combo"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-5 gap-8 items-stretch"
              >
                {/* Lado Esquerdo: presets */}
                <div className="md:col-span-3 space-y-4">
                  <span className="text-sm font-semibold text-muted-foreground block mb-2">
                    Selecione uma combinação de nicho validada:
                  </span>
                  
                  <div className="space-y-2.5">
                    {PRESET_COMBOS.map((combo) => {
                      const isSelected = selectedCombo.id === combo.id && !isCustomMode;
                      return (
                        <button
                          key={combo.id}
                          onClick={() => handleSelectPreset(combo)}
                          className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5"
                              : "bg-background/40 hover:bg-background/80 border-border/60 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                              isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            }`}>
                              {combo.score}
                            </div>
                            <div className="leading-snug">
                              <span className="font-bold text-foreground block">{combo.audience}</span>
                              <span className="text-xs text-muted-foreground">{combo.problem} → {combo.goal}</span>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <motion.div layoutId="check-preset">
                              <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lado Direito: Criador Manual / Crossover customizado */}
                <div className="md:col-span-2 flex flex-col justify-between bg-background/30 rounded-2xl p-5 border border-border/50">
                  <div className="space-y-4">
                    <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Target className="h-4.5 w-4.5 text-primary" /> Ou crie o seu crossover:
                    </span>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Público Alvo</label>
                        <input
                          type="text"
                          placeholder="Ex: Engenheiros Civis"
                          value={customAudience}
                          onChange={(e) => {
                            setCustomAudience(e.target.value);
                            setIsCustomMode(true);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Dor Principal</label>
                        <input
                          type="text"
                          placeholder="Ex: Fazer orçamentos de obras"
                          value={customProblem}
                          onChange={(e) => {
                            setCustomProblem(e.target.value);
                            setIsCustomMode(true);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Objetivo / Tecnologia</label>
                        <input
                          type="text"
                          placeholder="Ex: Reduzir erros de custos com IA"
                          value={customGoal}
                          onChange={(e) => {
                            setCustomGoal(e.target.value);
                            setIsCustomMode(true);
                          }}
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartSimulation}
                    className="w-full mt-6 bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-current" /> Simular Validação
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: ANALISANDO / RADAR SCANNING */}
            {activeTab === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 space-y-8"
              >
                {/* Sonar Radar Animado */}
                <div className="relative h-36 w-36 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-primary/10 animate-pulse" />
                  
                  {/* Radar sweep lines */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 flex items-center justify-center">
                    <div className="h-32 w-32 rounded-full border border-dashed border-primary/40 animate-[spin_5s_linear_infinite]" />
                  </div>
                  
                  {/* Central Glow Core */}
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/30 z-10">
                    <Zap className="h-8 w-8 text-white animate-bounce" />
                  </div>
                </div>

                {/* Status logs animando */}
                <div className="w-full max-w-md bg-background/50 border border-border/40 rounded-xl p-4 min-h-[120px] flex flex-col justify-center shadow-inner">
                  <div className="space-y-1.5">
                    {logs.slice(Math.max(0, logIndex - 2), logIndex + 1).map((log, idx) => {
                      const isLast = idx === Math.min(logIndex, 2);
                      return (
                        <motion.div
                          key={log}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: isLast ? 1 : 0.5, y: 0 }}
                          className={`text-sm ${isLast ? "text-primary font-bold" : "text-muted-foreground"} flex items-center gap-2`}
                        >
                          {isLast ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          )}
                          <span>{log}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPA 3: PAINEL DE DOENCAS DO NICHO / DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-5 gap-6 items-stretch"
              >
                
                {/* Lado Esquerdo: Resumo da oportunidade e Validação Social */}
                <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
                  {/* Score de Oportunidade */}
                  <div className="bg-background/40 border border-border/50 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full uppercase tracking-wider flex items-center gap-1">
                        🏆 GOLD RATING
                      </span>
                    </div>

                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                      Score de Oportunidade
                    </span>

                    <div className="flex items-center gap-4 py-2">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center p-[2px]">
                        <div className="h-full w-full rounded-full bg-card flex items-center justify-center font-extrabold text-2xl text-foreground">
                          {selectedCombo.score}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-foreground leading-tight">
                          {selectedCombo.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nicho: {selectedCombo.audience}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Saturação:</span>
                        <span className="font-bold text-foreground">{selectedCombo.saturation}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Complexidade:</span>
                        <span className="font-bold text-foreground">{selectedCombo.complexity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Validação de Dor (Reddit Card) */}
                  <div className="bg-background/40 border border-border/50 rounded-2xl p-5 flex-1 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-orange-500" /> VALIDAÇÃO DO REDDIT
                        </span>
                        <span className="text-[10px] text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                          {selectedCombo.reddit.subreddit}
                        </span>
                      </div>

                      <div className="bg-card/40 border border-border/40 rounded-xl p-3 text-xs leading-relaxed text-foreground italic relative min-h-[70px] flex items-center">
                        <span className="text-2xl text-muted-foreground/30 font-serif absolute -top-1 -left-1">“</span>
                        <p className="pl-4 pr-2">{selectedCombo.reddit.comment}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Dor Comprovada: {selectedCombo.reddit.sentiment}</span>
                    </div>
                  </div>

                </div>

                {/* Lado Direito: Google Books e Lean Canvas Tabs */}
                <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
                  {/* Validação de Compra (Google Books) */}
                  <div className="bg-background/40 border border-border/50 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4.5 w-4.5 text-purple-500" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Validação de Compra (Google Books)
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="h-14 w-10 bg-purple-500/10 border border-purple-500/20 rounded flex items-center justify-center shrink-0">
                        <BookOpen className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="text-xs">
                        <span className="font-bold text-foreground block leading-snug">
                          {selectedCombo.googleBooks.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">
                          {selectedCombo.googleBooks.rating}
                        </span>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          {selectedCombo.googleBooks.insight}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lean Canvas Gerado */}
                  <div className="bg-background/40 border border-border/50 rounded-2xl p-5 flex-1 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="h-4.5 w-4.5 text-primary" /> MOCK LEAN CANVAS GERADO
                        </span>
                        
                        <div className="flex gap-1">
                          {(["problema", "solucao", "vantagem"] as const).map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setCanvasTab(tab)}
                              className={`text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase cursor-pointer ${
                                canvasTab === tab
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conteúdo dinâmico das abas do canvas */}
                      <div className="text-xs leading-relaxed text-muted-foreground min-h-[85px] flex items-center">
                        <AnimatePresence mode="wait">
                          {canvasTab === "problema" && (
                            <motion.div
                              key="prob"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <strong className="text-foreground block mb-1">Dores do Cliente:</strong>
                              {selectedCombo.leanCanvas.problem}
                            </motion.div>
                          )}
                          {canvasTab === "solucao" && (
                            <motion.div
                              key="sol"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <strong className="text-foreground block mb-1">Proposta da IA:</strong>
                              {selectedCombo.leanCanvas.solution}
                            </motion.div>
                          )}
                          {canvasTab === "vantagem" && (
                            <motion.div
                              key="vant"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                            >
                              <strong className="text-foreground block mb-1">Vantagem Competitiva:</strong>
                              <span className="text-primary font-medium">{selectedCombo.leanCanvas.unfairAdvantage}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-4 mt-4 flex justify-between items-center">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-primary" />
                        <span>Isso é uma simulação da plataforma.</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("combo")}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" /> Testar Outro
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
