"use client";

import { useState } from "react";
import { Play, Volume2, VolumeX, Maximize, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function VideoDemo() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative rounded-[32px] overflow-hidden border border-blue-500/30 bg-gradient-to-b from-card via-card/90 to-background shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] group">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Video Frame Aspect Ratio 16:9 */}
        <div className="relative aspect-video w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          {isPlaying ? (
            <video 
              src="/demo.mp4" 
              controls 
              autoPlay 
              muted={isMuted}
              className="w-full h-full object-cover relative z-10"
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div 
              onClick={() => setIsPlaying(true)}
              className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group/player transition-all"
            >
              {/* Top Badge */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/10 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-red-500 absolute" />
                <span className="ml-2 font-mono">01:00</span>
              </div>

              {/* Quality Badge */}
              <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" /> 4K Ultra HD
              </div>

              {/* Big Pulsing Play Button */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 rounded-full bg-blue-500/30 blur-xl group-hover/player:bg-blue-500/50 transition-all animate-pulse" />
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 border border-white/20 transition-all duration-300 group-hover/player:scale-110 group-hover/player:shadow-blue-500/80">
                  <Play className="h-8 w-8 ml-1 fill-white" />
                </div>
              </div>

              {/* Video Title & Subtitle */}
              <h3 className="text-xl md:text-2xl font-black text-white max-w-xl drop-shadow-md">
                {isEn 
                  ? "Watch How ViralBook AI Finds Validated SaaS Opportunities in 60 Seconds" 
                  : isEs 
                  ? "Vea cómo ViralBook AI encuentra oportunidades de SaaS validadas en 60 segundos" 
                  : "Assista como o ViralBook AI encontra oportunidades validadas de SaaS em 60 segundos"}
              </h3>
              
              <p className="text-xs md:text-sm text-slate-300/80 mt-2 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                {isEn ? "Click to play 1-minute video demo" : isEs ? "Haga clic para reproducir el vídeo de 1 minuto" : "Clique para reproduzir a demonstração em vídeo de 1 minuto"}
              </p>

              {/* Bottom Bar Mockup */}
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3">
                <span className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ViralBook AI Platform Demo
                </span>
                <span className="font-mono text-slate-400">00:00 / 01:00</span>
              </div>
            </div>
          )}
        </div>

        {/* Video Description Banner */}
        <div className="p-6 md:p-8 bg-card/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/40">
          <div className="text-left space-y-1">
            <h4 className="font-bold text-foreground text-base">
              {isEn ? "Demonstration Video Space" : isEs ? "Espacio para Video Demonstrativo" : "Espaço Reservado para Vídeo de 1 Minuto"}
            </h4>
            <p className="text-xs md:text-sm text-muted-foreground">
              {isEn 
                ? "This section is configured to stream your 1-minute presentation video directly." 
                : isEs 
                ? "Esta sección está configurada para reproducir su video de presentación de 1 minuto." 
                : "Esta seção está pronta para reproduzir o seu vídeo de apresentação de 1 minuto (`/demo.mp4`)."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> MP4 / WebM Ready
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
