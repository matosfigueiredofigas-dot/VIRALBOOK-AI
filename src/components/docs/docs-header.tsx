"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useState, useCallback } from "react";

const ALL_SECTIONS = [
  { id: "prefacio",    labelPt: "Prefácio & Introdução",                labelEn: "Preface & Introduction",                labelEs: "Prefacio e Introducción" },
  { id: "capitulo-1",  labelPt: "Capítulo 1: História & Metodologia",  labelEn: "Chapter 1: History & Methodology",       labelEs: "Capítulo 1: Historia y Metodología" },
  { id: "capitulo-2",  labelPt: "Capítulo 2: Arquitetura & UX",        labelEn: "Chapter 2: Architecture & UX",           labelEs: "Capítulo 2: Arquitectura y UX" },
  { id: "capitulo-3",  labelPt: "Capítulo 3: Módulos & Botões",        labelEn: "Chapter 3: Modules & Buttons",           labelEs: "Capítulo 3: Módulos y Botones" },
  { id: "capitulo-4",  labelPt: "Capítulo 4: Geração de Ideias",       labelEn: "Chapter 4: Idea Generation",             labelEs: "Capítulo 4: Generación de Ideas" },
  { id: "capitulo-5",  labelPt: "Capítulo 5: Validação Científica",    labelEn: "Chapter 5: Scientific Validation",       labelEs: "Capítulo 5: Validación Científica" },
  { id: "capitulo-6",  labelPt: "Capítulo 6: Transformando em SaaS",   labelEn: "Chapter 6: Turning into SaaS",           labelEs: "Capítulo 6: Transformando en SaaS" },
  { id: "capitulo-7",  labelPt: "Capítulo 7: Conselho de 8 Mentores",  labelEn: "Chapter 7: 8-Mentor Board",              labelEs: "Capítulo 7: Consejo de 8 Mentores" },
  { id: "capitulo-8",  labelPt: "Capítulo 8: Roadmap de 30 Dias",      labelEn: "Chapter 8: 30-Day Roadmap",              labelEs: "Capítulo 8: Roadmap de 30 Días" },
  { id: "capitulo-9",  labelPt: "Capítulo 9: Prompts & IA Avançada",   labelEn: "Chapter 9: Prompts & Advanced AI",       labelEs: "Capítulo 9: Prompts e IA Avanzada" },
  { id: "capitulo-10", labelPt: "Capítulo 10: Estudos de Caso",        labelEn: "Chapter 10: Case Studies",               labelEs: "Capítulo 10: Estudios de Caso" },
  { id: "capitulo-11", labelPt: "Capítulo 11: FAQ & Limitações",       labelEn: "Chapter 11: FAQ & Limits",               labelEs: "Capítulo 11: FAQ y Limitaciones" },
  { id: "capitulo-12", labelPt: "Capítulo 12: Checklist de Lançamento",labelEn: "Chapter 12: Launch Checklist",           labelEs: "Capítulo 12: Checklist de Lanzamiento" },
];

export function DocsHeader() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isEs = language === "es";

  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<typeof ALL_SECTIONS>([]);
  const [searched, setSearched] = useState(false);

  const getLabel = (s: typeof ALL_SECTIONS[0]) =>
    isEn ? s.labelEn : isEs ? s.labelEs : s.labelPt;

  const handleSearch = useCallback(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setSearched(false); return; }
    const found = ALL_SECTIONS.filter((s) => getLabel(s).toLowerCase().includes(q));
    setResults(found);
    setSearched(true);
    // Auto-navega para o primeiro resultado
    if (found.length > 0) {
      const el = document.getElementById(found[0].id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [query, isEn, isEs]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => { setQuery(""); setResults([]); setSearched(false); };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      {/* Barra principal */}
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="md:hidden flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {isEn ? "Back" : isEs ? "Volver" : "Voltar"}
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
      </div>

      {/* Barra de pesquisa */}
      <div className="px-6 py-3 border-t border-border/30 flex items-center gap-2">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isEn ? "Search by chapter, tool or question..."
              : isEs ? "Buscar por capítulo, herramienta o duda..."
              : "Pesquisar por capítulo, ferramenta ou dúvida..."
            }
            className="w-full h-9 pl-9 pr-9 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="h-9 px-5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Search className="h-3.5 w-3.5" />
          {isEn ? "Search" : isEs ? "Buscar" : "Procurar"}
        </button>

        <span className="hidden md:block text-xs text-muted-foreground font-medium shrink-0">
          12 {isEn ? "Chapters" : isEs ? "Capítulos" : "Capítulos"} ·{" "}
          <span className="text-primary font-bold">PT / EN / ES</span>
        </span>
      </div>

      {/* Dropdown de resultados */}
      {searched && (
        <div className="px-6 pb-3">
          {results.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {isEn ? "No results found." : isEs ? "Sin resultados." : "Nenhum resultado encontrado."}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {results.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  onClick={() => {
                    const el = document.getElementById(r.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
                >
                  <Search className="h-3 w-3" />
                  {getLabel(r)}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
