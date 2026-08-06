"use client";

import { useState, useEffect } from "react";
import { 
  Play, Pause, ChevronLeft, ChevronRight, Lock, Radar, Lightbulb, 
  Cpu, Code, Sparkles, CheckCircle2, ShieldCheck, Star, Zap, Copy, 
  ArrowRight, BookOpen, Layers, Users, BarChart3, Terminal
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function VideoDemo() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 5 Fases do Workflow do ViralBook AI
  const slides = [
    {
      id: 1,
      step: isEn ? "Phase 1" : isEs ? "Fase 1" : "Fase 1",
      badge: isEn ? "Restricted Access & Security" : isEs ? "Acceso Restringido y Seguridad" : "Acesso Restrito & Segurança",
      title: isEn ? "1. Accessing the Platform" : isEs ? "1. Entrando al Acceso Restringido" : "1. Entrada no Acesso Restrito",
      subtitle: isEn 
        ? "Secure login via Supabase Auth with bio-protection and full API key management in the admin panel." 
        : isEs 
        ? "Inicio de sesión seguro a través de Supabase Auth con bioprotección y gestión de claves API." 
        : "Autenticação encriptada via Supabase Auth, suporte a login social com 1 clique e gestão dinâmica de chaves de IA (Gemini 2.0, Groq) no painel admin.",
      icon: Lock,
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-card/80 border border-primary/30 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">ViralBook AI Portal</h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Supabase Auth 256-bit SSL
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-semibold">Email do Empreendedor</div>
              <div className="h-9 w-full rounded-lg bg-background/80 border border-border px-3 flex items-center text-xs text-foreground font-mono">
                membro@viralbook.ai
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-muted-foreground font-semibold">Palavra-Passe Encriptada</div>
              <div className="h-9 w-full rounded-lg bg-background/80 border border-border px-3 flex items-center justify-between text-xs text-foreground font-mono">
                ••••••••••••••••
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            <Button className="w-full h-10 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-lg shadow-primary/30">
              Entrar na Área Membros
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      step: isEn ? "Phase 2" : isEs ? "Fase 2" : "Fase 2",
      badge: isEn ? "Global Radar Search" : isEs ? "Búsqueda en el Radar Global" : "Busca no Radar Global",
      title: isEn ? "2. Mining Bestsellers on Radar" : isEs ? "2. Minería de Bestsellers en el Radar" : "2. Mineração de Bestsellers no Radar",
      subtitle: isEn 
        ? "Search any book or niche (e.g. Atomic Habits). The AI analyzes Amazon reviews, Google Books sales, and calculates the Viral Score." 
        : isEs 
        ? "Busque cualquier libro o nicho. La IA analiza reseñas de Amazon y calcula el Score Viral." 
        : "Digite qualquer livro (ex: Atomic Habits, A Arte da Negociação) ou nicho. A IA analisa vendas na Amazon e calcula o Viral Opportunity Score (0-100).",
      icon: Radar,
      color: "from-indigo-500 to-purple-600",
      accentBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-card/80 border border-purple-500/30 shadow-2xl backdrop-blur-xl space-y-3">
            {/* Search Input Mockup */}
            <div className="h-10 w-full rounded-xl bg-background/80 border border-purple-500/40 px-3 flex items-center justify-between text-xs text-foreground font-medium">
              <span className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-purple-400 animate-spin" />
                Atomic Habits (James Clear)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                Pesquisando...
              </span>
            </div>

            {/* Book Result Card */}
            <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 flex gap-3 items-center">
              <div className="h-16 w-12 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-300 font-bold text-[10px]">
                COVER
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-foreground">Atomic Habits</h5>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Score: 92/100
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">James Clear · +15.000.000 cópias</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-current" /> 4.8 ★
                  </span>
                  <span className="text-[9px] font-semibold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                    #Produtividade
                  </span>
                </div>
              </div>
            </div>

            <Button className="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              ⚡ Analisar & Gerar Micro SaaS
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      step: isEn ? "Phase 3" : isEs ? "Fase 3" : "Fase 3",
      badge: isEn ? "Ideas & Niche Crossover" : isEs ? "Ideas y Crossover de Nichos" : "Biblioteca de Ideias & Crossovers",
      title: isEn ? "3. Niche Crossover & Ideas Library" : isEs ? "3. Crossover de Nichos y Biblioteca" : "3. Biblioteca de Ideias & Crossovers",
      subtitle: isEn 
        ? "Explore 50+ validated matrices. Blend 2 profitable niches (e.g. Productivity + Real Estate) to create uncompeted Micro SaaS." 
        : isEs 
        ? "Explore más de 50 matrices. Combine 2 nichos rentables para crear Micro SaaS sin competencia." 
        : "Explore mais de 50 matrizes de negócios validadas. Misture 2 nichos rentáveis (ex: Produtividade + Imobiliário) para gerar ideias de Micro SaaS sem concorrência direta.",
      icon: Lightbulb,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-card/80 border border-amber-500/30 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                Matriz Crossover de Nichos
              </span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Alta Oportunidade
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300">
                Nicho A: Hábitos Diários
              </div>
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-300">
                Nicho B: Imobiliário & Corretores
              </div>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1 text-left">
              <span className="text-[10px] font-bold text-primary uppercase">💡 Micro SaaS Resultante:</span>
              <h5 className="text-xs font-bold text-foreground">HabitRealtor AI</h5>
              <p className="text-[11px] text-muted-foreground">
                Automação de rotinas diárias de prospecção para corretores de imóveis baseada no método Atomic Habits.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-muted-foreground">
              <span>MRR Projetado: <strong className="text-emerald-400">$4,500/mês</strong></span>
              <span>Dificuldade: <strong className="text-amber-400">Média</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      step: isEn ? "Phase 4" : isEs ? "Fase 4" : "Fase 4",
      badge: isEn ? "Multi-Agent AI Mentorship" : isEs ? "Mentoría IA Multi-Agente" : "Conselho de Mentores de IA",
      title: isEn ? "4. AI Multi-Agent Diagnosis" : isEs ? "4. Diagnóstico IA Multi-Agente" : "4. Análise pela IA Multi-Agente",
      subtitle: isEn 
        ? "8 specialized AI Mentors dissect Lean Canvas, extract 3-star Amazon complaints, and project revenue models." 
        : isEs 
        ? "8 Mentores de IA disecan el Lean Canvas y analizan quejas de 3 estrellas en Amazon." 
        : "8 Mentores de IA especializados (Alex Hormozi, Eric Ries, Steve Blank...) dissecam o Lean Canvas, extraem dores de reviews 3 estrelas e calculam projeção de faturação.",
      icon: Cpu,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-card/80 border border-emerald-500/30 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                Conselho dos 8 Mentores de IA
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Lean Canvas Ativo
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-300">Hormozi</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-300">Eric Ries</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-300">Steve Blank</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-300">Naval</div>
            </div>

            <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1.5 text-left">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                <span>🔥 Dor Extraída dos Reviews (3★):</span>
                <span>Subscrição: $19/mês</span>
              </div>
              <p className="text-[11px] text-muted-foreground italic">
                "Os leitores amam a teoria do livro, mas não conseguem rastrear o progresso manualmente sem um software automático."
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1 text-muted-foreground">
              <span>Desenvolvimento: <strong className="text-foreground">14 dias</strong></span>
              <span>Score de IA: <strong className="text-emerald-400">88% (Aprovado)</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      step: isEn ? "Phase 5" : isEs ? "Fase 5" : "Fase 5",
      badge: isEn ? "Instant Code Prompting" : isEs ? "Generación de Prompts de Código" : "Geração de Prompts para IA",
      title: isEn ? "5. AI Code Prompt Engineering" : isEs ? "5. Prompts listos para Lovable y Bolt" : "5. Prompts Prontos para Lovable & Bolt",
      subtitle: isEn 
        ? "Copy in 1-click structured prompts to build your MVP on Lovable.dev or Bolt.new in minutes." 
        : isEs 
        ? "Copie prompts técnicos estructurados con 1 clic para construir su MVP en Lovable o Bolt." 
        : "Copie em 1 clique o prompt técnico detalhado e cole no Lovable.dev, Bolt.new ou Cursor para ter a aplicação web 100% construída e pronta a rodar em minutos!",
      icon: Code,
      color: "from-blue-600 to-cyan-500",
      accentBg: "bg-blue-600/10 border-blue-600/30 text-blue-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-card/80 border border-blue-500/30 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
                <Terminal className="h-4 w-4 text-blue-400" />
                Prompt Lovable.dev & Bolt.new
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Estruturado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1 text-left overflow-hidden max-h-24">
              <span className="text-blue-400">// Prompt de Engenharia Gerado pela IA:</span>
              <p className="line-clamp-3 leading-relaxed text-slate-400">
                Create a fullstack Next.js SaaS app named HabitRealtor AI. Include dashboard, habit tracker grid based on Atomic Habits, Supabase authentication, and billing integration with Stripe...
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => {
                  setCopiedIndex(5);
                  setTimeout(() => setCopiedIndex(null), 2000);
                }}
                className="h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-xl shadow-lg shadow-blue-600/30"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                {copiedIndex === 5 ? "Copiado!" : "Copiar p/ Lovable"}
              </Button>
              <Button 
                onClick={() => {
                  setCopiedIndex(55);
                  setTimeout(() => setCopiedIndex(null), 2000);
                }}
                variant="outline"
                className="h-9 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-bold text-[11px] rounded-xl"
              >
                <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                {copiedIndex === 55 ? "Copiado!" : "Copiar p/ Bolt.new"}
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Navegação por Abas (Steps 1 a 5) */}
      <div className="grid grid-cols-5 gap-2 p-1.5 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-xl">
        {slides.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === activeSlide;
          return (
            <button
              key={s.id}
              onClick={() => {
                setActiveSlide(idx);
                setIsAutoPlaying(false);
              }}
              className={`p-2.5 rounded-xl transition-all flex flex-col items-center gap-1.5 text-center cursor-pointer relative overflow-hidden ${
                isActive 
                  ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
              <span className="text-[11px] font-bold line-clamp-1">{s.step}</span>
              
              {/* Barra de Progresso no Slide Ativo */}
              {isActive && isAutoPlaying && (
                <div className="absolute bottom-0 left-0 h-1 bg-white/40 animate-[progress_6s_linear_infinite] w-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Slide Principal Simulador 16:9 */}
      <div className="relative rounded-[32px] overflow-hidden border border-primary/20 bg-card/90 shadow-[0_0_80px_-20px_rgba(59,130,246,0.25)] group">
        
        {/* Aspect Ratio 16:9 */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between overflow-hidden">
          
          {/* Background Gradient Mesh */}
          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${currentSlide.color} blur-3xl pointer-events-none transition-all duration-700`} />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Top Bar Header do Slide */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${currentSlide.accentBg}`}>
              <currentSlide.icon className="h-4 w-4" />
              {currentSlide.badge}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="h-8 px-3 rounded-full text-xs font-bold text-white bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10"
              >
                {isAutoPlaying ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
                {isAutoPlaying ? (isEn ? "Pause" : "Pausar") : (isEn ? "Auto Play" : "Auto Reproduzir")}
              </Button>
            </div>
          </div>

          {/* Conteúdo Visual / Mockup Interativo do Slide */}
          <div className="relative z-20 flex-1 flex items-center justify-center px-6">
            {currentSlide.mockup}
          </div>

          {/* Controles Laterais (Anterior / Próximo) */}
          <button
            onClick={() => {
              setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
              setIsAutoPlaying(false);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => {
              setActiveSlide((prev) => (prev + 1) % slides.length);
              setIsAutoPlaying(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/10 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Bottom Bar Footer com Descrição do Slide */}
          <div className="relative z-20 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {currentSlide.title}
              </h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {currentSlide.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono font-semibold text-slate-400">
                Passo {activeSlide + 1} de 5
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
