"use client";

import Link from "next/link";
import { BookOpen, LayoutDashboard, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function DocsSidebar() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isEs = language === "es";

  const chapters = [
    { 
      id: "capitulo-1", 
      title: isEn ? "Chapter 1: History & Methodology" : isEs ? "Capítulo 1: Historia y Metodología" : "Capítulo 1: História & Metodologia" 
    },
    { 
      id: "capitulo-2", 
      title: isEn ? "Chapter 2: Architecture & UX" : isEs ? "Capítulo 2: Arquitectura y UX" : "Capítulo 2: Arquitetura & UX" 
    },
    { 
      id: "capitulo-3", 
      title: isEn ? "Chapter 3: Modules & Buttons" : isEs ? "Capítulo 3: Módulos y Botones" : "Capítulo 3: Módulos & Botões" 
    },
    { 
      id: "capitulo-4", 
      title: isEn ? "Chapter 4: Idea Generation" : isEs ? "Capítulo 4: Generación de Ideas" : "Capítulo 4: Geração de Ideias" 
    },
    { 
      id: "capitulo-5", 
      title: isEn ? "Chapter 5: Scientific Validation" : isEs ? "Capítulo 5: Validación Científica" : "Capítulo 5: Validação Científica" 
    },
    { 
      id: "capitulo-6", 
      title: isEn ? "Chapter 6: Turning into SaaS" : isEs ? "Capítulo 6: Transformando en SaaS" : "Capítulo 6: Transformando em SaaS" 
    },
    { 
      id: "capitulo-7", 
      title: isEn ? "Chapter 7: 8-Mentor Board" : isEs ? "Capítulo 7: Consejo de 8 Mentores" : "Capítulo 7: Conselho de 8 Mentores" 
    },
    { 
      id: "capitulo-8", 
      title: isEn ? "Chapter 8: 30-Day Roadmap" : isEs ? "Capítulo 8: Roadmap de 30 Días" : "Capítulo 8: Roadmap de 30 Dias" 
    },
    { 
      id: "capitulo-9", 
      title: isEn ? "Chapter 9: Prompts & AI" : isEs ? "Capítulo 9: Prompts e IA Avanzada" : "Capítulo 9: Prompts & IA Avançada" 
    },
    { 
      id: "capitulo-10", 
      title: isEn ? "Chapter 10: Case Studies" : isEs ? "Capítulo 10: Estudios de Caso" : "Capítulo 10: Estudos de Caso" 
    },
    { 
      id: "capitulo-11", 
      title: isEn ? "Chapter 11: FAQ & Limits" : isEs ? "Capítulo 11: FAQ y Limitaciones" : "Capítulo 11: FAQ & Limitações" 
    },
    { 
      id: "capitulo-12", 
      title: isEn ? "Chapter 12: Launch Checklist" : isEs ? "Capítulo 12: Checklist de Lanzamiento" : "Capítulo 12: Checklist de Lançamento" 
    },
  ];

  return (
    <aside className="w-72 border-r border-border/50 bg-card/60 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
      <div className="h-20 flex items-center px-6 border-b border-border/50 shrink-0 gap-3">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight block leading-tight">ViralBook AI</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {isEn ? "Official Manual" : isEs ? "Manual Oficial" : "Manual Oficial"}
            </span>
          </div>
        </Link>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 mb-3">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {isEn ? "Book Index" : isEs ? "Índice del Libro" : "Índice do Livro"}
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {isEn ? "12 Chapters" : isEs ? "12 Capítulos" : "12 Capítulos"}
            </span>
          </div>
          <div className="space-y-1">
            <Link href="/docs#prefacio" className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted text-foreground font-medium transition-colors">
              <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
              {isEn ? "Preface & Introduction" : isEs ? "Prefacio e Introducción" : "Prefácio & Introdução"}
            </Link>
            {chapters.map((cap) => (
              <Link 
                key={cap.id} 
                href={`/docs#${cap.id}`} 
                className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors truncate"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0"></span>
                <span className="truncate">{cap.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border/50 space-y-2">
        <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md">
          <LayoutDashboard className="h-4 w-4" />
          {isEn ? "Back to Dashboard" : isEs ? "Volver al Dashboard" : "Voltar ao Dashboard"}
        </Link>
      </div>
    </aside>
  );
}
