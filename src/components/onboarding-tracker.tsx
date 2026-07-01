"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronRight, X, Sparkles } from "lucide-react";

const STEPS = [
  { id: "search", label: "Buscar um livro ou nicho" },
  { id: "save", label: "Salvar uma ideia nos Favoritos" },
  { id: "canvas", label: "Gerar um Lean Canvas" },
  { id: "export", label: "Exportar ou Compartilhar" },
];

const STORAGE_KEY = "viralbook_onboarding_v1";

function getStepsFromStorage(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function OnboardingTracker() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = getStepsFromStorage();
    setCompleted(stored);
    const dismissedKey = localStorage.getItem("viralbook_onboarding_dismissed");
    if (dismissedKey === "true") setDismissed(true);
  }, []);

  const completedCount = STEPS.filter((s) => completed[s.id]).length;
  const percent = Math.round((completedCount / STEPS.length) * 100);
  const allDone = completedCount === STEPS.length;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("viralbook_onboarding_dismissed", "true");
  };

  if (dismissed || allDone) return null;

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted/50 border border-border/50 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
        title="Ver progresso de onboarding"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">{completedCount}/{STEPS.length} passos</span>
        {/* Mini progress arc */}
        <div className="h-3.5 w-3.5 relative">
          <svg viewBox="0 0 14 14" className="rotate-[-90deg]">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
            <circle
              cx="7" cy="7" r="5"
              fill="none"
              stroke="hsl(217 91% 60%)"
              strokeWidth="2"
              strokeDasharray={`${(percent / 100) * 31.4} 31.4`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="absolute top-10 right-0 w-64 bg-popover border border-border/60 rounded-xl shadow-xl p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-foreground">🚀 Primeiros Passos</span>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <ul className="space-y-2.5">
            {STEPS.map((step) => (
              <li key={step.id} className="flex items-center gap-2.5 text-xs">
                {completed[step.id] ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                )}
                <span className={completed[step.id] ? "text-muted-foreground line-through" : "text-foreground"}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDismiss}
            className="mt-4 w-full text-[10px] text-muted-foreground/60 hover:text-muted-foreground underline"
          >
            Ocultar este painel
          </button>
        </div>
      )}
    </div>
  );
}
