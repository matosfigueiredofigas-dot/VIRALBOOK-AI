"use client";

import { useState, useEffect } from "react";
import { 
  Play, Pause, ChevronLeft, ChevronRight, Lock, Radar, Lightbulb, 
  Cpu, Code, Sparkles, CheckCircle2, ShieldCheck, Star, Zap, Copy, 
  ArrowRight, Layers, Users, Terminal, Flame, Eye, Video, X, ShieldAlert
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

interface VideoDemoProps {
  onOpenAuth?: (tab: "login" | "signup") => void;
}

export function VideoDemo({ onOpenAuth }: VideoDemoProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"interactive" | "video">("interactive");
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // 5 Fases Ultra-Cinematográficas de Conversão do ViralBook AI
  const slides = [
    {
      id: 1,
      stepNumber: "01",
      step: isEn ? "Phase 01" : isEs ? "Fase 01" : "Fase 01",
      badge: isEn ? "Biometric Security & Auth" : isEs ? "Seguridad Biométrica y Login" : "Acesso Restrito & Autenticação",
      title: isEn ? "1. Restricted Access & Security Portal" : isEs ? "1. Portal de Acceso Restringido y Seguridad" : "1. Entrada no Acesso Restrito & Portal de Membros",
      subtitle: isEn 
        ? "Encrypted authentication via Supabase Auth 256-bit. Dynamic API key manager (Gemini 2.0, Groq) directly in your private dashboard." 
        : isEs 
        ? "Autenticación cifrada a través de Supabase Auth. Gestión dinámica de claves API (Gemini 2.0, Groq) en su panel privado." 
        : "Autenticação encriptada via Supabase Auth SSL 256-bit, suporte a login social instantâneo e gestão de chaves de IA (Gemini 2.0 Flash, Groq) no painel admin.",
      icon: Lock,
      color: "from-blue-600 via-indigo-600 to-cyan-500",
      accentGlow: "shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] border-blue-500/40",
      badgeStyle: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 space-y-4">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-slate-900/90 border border-blue-500/40 shadow-2xl backdrop-blur-2xl space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40 shadow-inner">
                  <ShieldCheck className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-extrabold text-white tracking-wide">VIRALBOOK PORTAL</h4>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Supabase 256-Bit Encrypted
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO MEMBRO
              </span>
            </div>

            <div className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Email do Fundador</label>
                <div className="h-9 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 flex items-center text-xs text-slate-200 font-mono">
                  fundador@viralbook.ai
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Chave de IA (Gemini 2.0 / Groq)</label>
                <div className="h-9 w-full rounded-xl bg-slate-950 border border-slate-800 px-3 flex items-center justify-between text-xs text-emerald-400 font-mono">
                  <span>AI_KEY_ACTIVE_••••••••</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onOpenAuth && onOpenAuth("login")}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              Entrar no Acesso Restrito
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 2,
      stepNumber: "02",
      step: isEn ? "Phase 02" : isEs ? "Fase 02" : "Fase 02",
      badge: isEn ? "Global Book Radar & Bestsellers" : isEs ? "Radar Global y Bestsellers" : "Radar Global & Mineração de Bestsellers",
      title: isEn ? "2. Mining Bestsellers on Global Radar" : isEs ? "2. Minería de Bestsellers en el Radar Global" : "2. Mineração de Bestsellers no Radar Global",
      subtitle: isEn 
        ? "Search any book or niche (e.g. Atomic Habits, The Art of Deal). The AI instantly calculates the Viral Opportunity Score (0-100)." 
        : isEs 
        ? "Busque cualquier libro o nicho. La IA calcula al instante el Score de Oportunidad Viral (0-100)." 
        : "Pesquise qualquer livro (ex: Atomic Habits, A Arte da Negociação) ou nicho. A IA analisa vendas na Amazon, volume no Google Books e calcula o Viral Opportunity Score (0-100).",
      icon: Radar,
      color: "from-purple-600 via-indigo-600 to-pink-500",
      accentGlow: "shadow-[0_0_50px_-10px_rgba(168,85,247,0.5)] border-purple-500/40",
      badgeStyle: "bg-purple-500/10 border-purple-500/30 text-purple-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-2xl backdrop-blur-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full pointer-events-none" />

            {/* Live Search Bar Mockup */}
            <div className="h-10 w-full rounded-xl bg-slate-950 border border-purple-500/40 px-3 flex items-center justify-between text-xs text-white font-medium">
              <span className="flex items-center gap-2 font-semibold">
                <Radar className="h-4 w-4 text-purple-400 animate-spin" />
                "Atomic Habits" (James Clear)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                VARREDURA ATIVA
              </span>
            </div>

            {/* Bestseller Live Result Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/30 flex gap-3 items-center text-left">
              <div className="h-16 w-12 rounded-lg bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/40 flex flex-col items-center justify-center shrink-0 text-purple-300 font-black text-[9px] shadow-md">
                <span>COVER</span>
                <span className="text-[7px] text-amber-400 font-bold">8K 3D</span>
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs md:text-sm font-extrabold text-white truncate">Atomic Habits</h5>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    Score: 94/100 🔥
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 truncate">James Clear · +15.000.000 cópias</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[9px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-current" /> 4.8 ★
                  </span>
                  <span className="text-[9px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                    #Produtividade
                  </span>
                </div>
              </div>
            </div>

            <Button className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/30">
              <Sparkles className="mr-1.5 h-4 w-4" />
              ⚡ Analisar & Gerar Micro SaaS
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 3,
      stepNumber: "03",
      step: isEn ? "Phase 03" : isEs ? "Fase 03" : "Fase 03",
      badge: isEn ? "Niche Crossover & Ideas Matrix" : isEs ? "Matriz Crossover de Nichos" : "Biblioteca de Ideias & Crossovers",
      title: isEn ? "3. Niche Crossover & Ideas Library" : isEs ? "3. Crossover de Nichos y Biblioteca de Ideas" : "3. Crossover de Nichos & Biblioteca de Ideias",
      subtitle: isEn 
        ? "Explore 50+ pre-validated matrices. Cross 2 profitable niches (e.g. Daily Habits + Real Estate) to launch uncompeted Micro SaaS." 
        : isEs 
        ? "Explore más de 50 matrices. Combine 2 nichos rentables para lanzar Micro SaaS sin competencia." 
        : "Explore mais de 50 matrizes de negócios validadas. Misture 2 nichos rentáveis (ex: Hábitos Diários × Imobiliário = HabitRealtor AI) para criar produtos sem concorrência direta.",
      icon: Lightbulb,
      color: "from-amber-500 via-orange-600 to-red-500",
      accentGlow: "shadow-[0_0_50px_-10px_rgba(245,158,11,0.5)] border-amber-500/40",
      badgeStyle: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-2xl backdrop-blur-2xl space-y-3 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                Crossover Matrix 2.0
              </span>
              <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                Nicho Azul (Zero Concorrência)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-extrabold text-amber-300">
                Nicho A: Hábitos Diários
              </div>
              <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs font-extrabold text-orange-300">
                Nicho B: Corretores de Imóveis
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">💡 Micro SaaS de Alto Valor:</span>
              <h5 className="text-xs font-extrabold text-white">HabitRealtor AI Pro</h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Automação de rotinas diárias de prospecção imobiliária baseada no método Atomic Habits.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">MRR Estimado: <strong className="text-emerald-400 font-extrabold">$4,500/mês</strong></span>
              <span className="text-slate-400">Dificuldade: <strong className="text-amber-400 font-extrabold">Baixa / Média</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      stepNumber: "04",
      step: isEn ? "Phase 04" : isEs ? "Fase 04" : "Fase 04",
      badge: isEn ? "8 AI Virtual Mentors" : isEs ? "8 Mentores Virtuales de IA" : "Conselho dos 8 Mentores de IA",
      title: isEn ? "4. Multi-Agent AI Mentorship & Pain Extraction" : isEs ? "4. Diagnóstico Multi-Agente y Extracción de Dolores" : "4. Diagnóstico por 8 Mentores de IA & Radiografia de 3★",
      subtitle: isEn 
        ? "8 specialized AI Mentors (Alex Hormozi, Eric Ries, Steve Blank...) dissect the Lean Canvas and extract real complaints from Amazon 3-star reviews." 
        : isEs 
        ? "8 Mentores de IA disecan el Lean Canvas y extraen quejas reales de las reseñas de 3 estrellas de Amazon." 
        : "8 Mentores de IA especializados (Alex Hormozi, Eric Ries, Steve Blank, Naval...) dissecam o Lean Canvas, extraem dores reais de reviews de 3 estrelas na Amazon e projetam o modelo de faturação.",
      icon: Cpu,
      color: "from-emerald-500 via-teal-600 to-cyan-500",
      accentGlow: "shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)] border-emerald-500/40",
      badgeStyle: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl space-y-3 text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                Conselho dos 8 Mentores Virtuais
              </span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Lean Canvas 100% Gerado
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-300">Hormozi</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-300">Eric Ries</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-300">Steve Blank</div>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-300">Naval</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-extrabold text-emerald-400">
                <span>🔥 Queixa Principal dos Reviews 3★:</span>
                <span>$19/mês</span>
              </div>
              <p className="text-[11px] text-slate-300 italic leading-relaxed">
                "O conceito do livro é espetacular, mas acompanhar as rotinas no papel dá muito trabalho. Falta um software automático."
              </p>
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <span className="text-slate-400">Tempo de MVP: <strong className="text-white font-extrabold">14 dias</strong></span>
              <span className="text-slate-400">Score de Mentoria: <strong className="text-emerald-400 font-extrabold">92% (Aprovado)</strong></span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      stepNumber: "05",
      step: isEn ? "Phase 05" : isEs ? "Fase 05" : "Fase 05",
      badge: isEn ? "Instant Code Prompt Generator" : isEs ? "Prompts de Código para IA" : "Geração de Prompts Prontos para IA",
      title: isEn ? "5. Prompts Ready for Lovable.dev & Bolt.new" : isEs ? "5. Prompts listos para Lovable y Bolt" : "5. Prompts Prontos para Lovable.dev & Bolt.new",
      subtitle: isEn 
        ? "Copy technical prompts in 1-click and build your MVP in Lovable, Bolt.new or Cursor in under 48 hours." 
        : isEs 
        ? "Copie prompts técnicos en 1 clic para construir su MVP en Lovable o Bolt en menos de 48 horas." 
        : "Copie em 1 clique o prompt técnico detalhado e cole no Lovable.dev, Bolt.new ou Cursor para ter a aplicação web 100% construída e pronta a rodar em minutos!",
      icon: Code,
      color: "from-cyan-500 via-blue-600 to-indigo-600",
      accentGlow: "shadow-[0_0_50px_-10px_rgba(6,182,212,0.5)] border-cyan-500/40",
      badgeStyle: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
      mockup: (
        <div className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 space-y-4">
          <div className="w-full max-w-md p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl space-y-3 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-extrabold text-white flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-cyan-400" />
                Prompt Lovable.dev & Bolt.new
              </span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                PRONTO A COPIAR
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1 overflow-hidden max-h-24">
              <span className="text-cyan-400 font-bold">// Prompt de Engenharia Gerado pela IA:</span>
              <p className="line-clamp-3 leading-relaxed text-slate-400">
                Create a fullstack Next.js SaaS app named HabitRealtor AI. Include dashboard, habit tracker grid based on Atomic Habits, Supabase authentication, and billing integration...
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => {
                  setCopiedIndex(5);
                  setTimeout(() => setCopiedIndex(null), 2000);
                }}
                className="h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-[11px] rounded-xl shadow-lg shadow-blue-500/30 cursor-pointer"
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
                className="h-10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 font-extrabold text-[11px] rounded-xl cursor-pointer"
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

  // Auto-play timer (6 segundos por slide)
  useEffect(() => {
    if (!isAutoPlaying || viewMode === "video") return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Seletor Superior: Carrossel Guiado vs Player de Vídeo MP4 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setViewMode("interactive");
              setIsPlayingVideo(false);
            }}
            variant={viewMode === "interactive" ? "default" : "ghost"}
            className={`h-9 px-4 rounded-xl font-extrabold text-xs transition-all ${
              viewMode === "interactive" 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-yellow-400" />
            {isEn ? "Cinematic Workflow (5 Steps)" : isEs ? "Workflow Cinematográfico (5 Pasos)" : "Workflow Cinematográfico (5 Fases)"}
          </Button>

          <Button
            onClick={() => {
              setViewMode("video");
              setIsPlayingVideo(true);
            }}
            variant={viewMode === "video" ? "default" : "ghost"}
            className={`h-9 px-4 rounded-xl font-extrabold text-xs transition-all ${
              viewMode === "video" 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Video className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
            {isEn ? "Watch Video Demo (MP4)" : isEs ? "Ver Video Demo (MP4)" : "Ver Vídeo de Apresentação (MP4)"}
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-300 font-bold px-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SISTEMA 100% OPERACIONAL</span>
        </div>
      </div>

      {/* MODAL / SEÇÃO DE VÍDEO MP4 CASO O SELETOR ESTEJA EM "VIDEO" */}
      {viewMode === "video" ? (
        <div className="relative rounded-[32px] overflow-hidden border border-blue-500/40 bg-slate-950 shadow-[0_0_80px_-20px_rgba(59,130,246,0.4)] aspect-video w-full flex items-center justify-center">
          <video 
            src="/demo.mp4" 
            controls 
            autoPlay 
            className="w-full h-full object-cover relative z-10"
          />
        </div>
      ) : (
        <>
          {/* Navegação por 5 Passos / Steps */}
          <div className="grid grid-cols-5 gap-2 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
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
                  className={`p-2.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-1.5 text-center cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary to-blue-600 text-white font-extrabold shadow-lg shadow-primary/30 scale-[1.03] border border-white/20' 
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono opacity-80">{s.stepNumber}.</span>
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <span className="text-[11px] font-extrabold line-clamp-1">{s.step}</span>
                  
                  {/* Barra de Progresso no Slide Ativo */}
                  {isActive && isAutoPlaying && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/60 animate-[progress_6s_linear_infinite] w-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Card Principal 16:9 Ultra-Cinematográfico */}
          <div className={`relative rounded-[32px] overflow-hidden border bg-slate-950 transition-all duration-500 ${currentSlide.accentGlow}`}>
            
            {/* Aspect Ratio 16:9 */}
            <div className="relative aspect-video w-full flex flex-col justify-between overflow-hidden">
              
              {/* Background Glow Mesh */}
              <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${currentSlide.color} blur-3xl pointer-events-none transition-all duration-700`} />
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

              {/* Header do Slide */}
              <div className="relative z-20 p-6 flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold backdrop-blur-md shadow-lg ${currentSlide.badgeStyle}`}>
                  <currentSlide.icon className="h-4 w-4" />
                  {currentSlide.badge}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="h-8 px-3 rounded-full text-xs font-bold text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 cursor-pointer"
                  >
                    {isAutoPlaying ? <Pause className="h-3.5 w-3.5 mr-1 text-amber-400" /> : <Play className="h-3.5 w-3.5 mr-1 text-emerald-400" />}
                    {isAutoPlaying ? (isEn ? "Pause" : "Pausar") : (isEn ? "Auto Play" : "Auto Reproduzir")}
                  </Button>
                </div>
              </div>

              {/* Conteúdo Visual / Mockup Interativo em 3D */}
              <div className="relative z-20 flex-1 flex items-center justify-center px-4 md:px-8">
                {currentSlide.mockup}
              </div>

              {/* Controles Laterais (Anterior / Próximo) */}
              <button
                onClick={() => {
                  setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
                  setIsAutoPlaying(false);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-slate-900/80 hover:bg-black text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-xl"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() => {
                  setActiveSlide((prev) => (prev + 1) % slides.length);
                  setIsAutoPlaying(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-slate-900/80 hover:bg-black text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-xl"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Footer Banner de Descrição & Alta Conversão */}
              <div className="relative z-20 p-6 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    {currentSlide.title}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-medium">
                    {currentSlide.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button 
                    onClick={() => onOpenAuth ? onOpenAuth("signup") : (window.location.href = "/radar")}
                    className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    <Zap className="mr-1.5 h-4 w-4 fill-current" />
                    Testar Esta Fase Agora
                  </Button>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}
