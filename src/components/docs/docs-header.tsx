"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";

export function DocsHeader() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isEs = language === "es";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {isEn ? "Back" : isEs ? "Volver" : "Voltar"}
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>
            {isEn 
              ? "Official Documentation and Operating Manual for ViralBook AI" 
              : isEs 
              ? "Documentación Oficial y Manual de Operación de ViralBook AI" 
              : "Documentação Oficial e Manual de Operação do ViralBook AI"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
