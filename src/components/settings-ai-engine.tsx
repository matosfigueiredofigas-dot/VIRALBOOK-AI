"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  MessageCircle,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AIEngineSettings } from "@/hooks/use-settings";

// ============================================================
// Types
// ============================================================

interface Props {
  settings: AIEngineSettings;
  onUpdate: (updates: Partial<AIEngineSettings>) => void;
}

// ============================================================
// Slider config
// ============================================================

interface SliderConfig {
  key: keyof Pick<
    AIEngineSettings,
    "weightTrends" | "weightReddit" | "weightFacebook" | "weightAIConfidence"
  >;
  label: string;
  icon: React.ElementType;
  color: string;       // tailwind-friendly hex / named color for the filled track
  thumbBorder: string; // border color class for the thumb
}

const SLIDERS: SliderConfig[] = [
  {
    key: "weightTrends",
    label: "Google Trends Growth",
    icon: TrendingUp,
    color: "#22c55e",
    thumbBorder: "border-green-500",
  },
  {
    key: "weightReddit",
    label: "Reddit Mentions",
    icon: MessageCircle,
    color: "#f97316",
    thumbBorder: "border-orange-500",
  },
  {
    key: "weightFacebook",
    label: "Facebook Signals",
    icon: Share2,
    color: "#3b82f6",
    thumbBorder: "border-blue-500",
  },
  {
    key: "weightAIConfidence",
    label: "AI Confidence",
    icon: Brain,
    color: "#a855f7",
    thumbBorder: "border-purple-500",
  },
];

// ============================================================
// Generation modes
// ============================================================

interface ModeOption {
  value: AIEngineSettings["generationMode"];
  emoji: string;
  title: string;
  description: string;
  recommended?: boolean;
}

const MODES: ModeOption[] = [
  {
    value: "conservative",
    emoji: "🛡️",
    title: "Conservador",
    description: "Apenas oportunidades com alta confiança",
  },
  {
    value: "balanced",
    emoji: "⚖️",
    title: "Balanceado",
    description: "Equilíbrio entre quantidade e qualidade",
    recommended: true,
  },
  {
    value: "aggressive",
    emoji: "🚀",
    title: "Agressivo",
    description: "Mais ideias, incluindo experimentais",
  },
];

// ============================================================
// Component
// ============================================================

export function SettingsAIEngine({ settings, onUpdate }: Props) {
  const total = useMemo(
    () =>
      settings.weightTrends +
      settings.weightReddit +
      settings.weightFacebook +
      settings.weightAIConfidence,
    [
      settings.weightTrends,
      settings.weightReddit,
      settings.weightFacebook,
      settings.weightAIConfidence,
    ]
  );

  const isTotalValid = total === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────── */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-purple-600/20 via-violet-500/10 to-transparent border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Motor de IA</h3>
            <p className="text-sm text-muted-foreground">
              Ajuste os pesos do algoritmo de pontuação e modo de geração
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ── 1. Score Weight Sliders ──────────────── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Pesos de Pontuação
            </h4>

            {/* Total indicator */}
            <Badge
              variant={isTotalValid ? "default" : "outline"}
              className={
                isTotalValid
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/40"
              }
            >
              {isTotalValid ? (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              ) : (
                <AlertTriangle className="w-3 h-3 mr-1" />
              )}
              Total: {total}%
            </Badge>
          </div>

          {!isTotalValid && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-xs text-amber-400"
            >
              ⚠ O total dos pesos deve somar 100% para resultados ideais.
            </motion.p>
          )}

          <div className="space-y-4">
            {SLIDERS.map((slider) => {
              const Icon = slider.icon;
              const value = settings[slider.key] as number;

              return (
                <div key={slider.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-4 h-4"
                        style={{ color: slider.color }}
                      />
                      <span className="text-sm font-medium">
                        {slider.label}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="tabular-nums min-w-[3rem] justify-center"
                    >
                      {value}%
                    </Badge>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={value}
                    onChange={(e) =>
                      onUpdate({ [slider.key]: Number(e.target.value) })
                    }
                    className={`w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:cursor-pointer ${slider.thumbBorder}`}
                    style={{
                      background: `linear-gradient(to right, ${slider.color} 0%, ${slider.color} ${value}%, hsl(var(--app-muted)) ${value}%, hsl(var(--app-muted)) 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 2. Score Formula Preview (mini bar chart) */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pré-visualização da Fórmula
          </h4>

          <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/40">
            {SLIDERS.map((slider) => {
              const value = settings[slider.key] as number;
              return (
                <div key={slider.key} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 truncate">
                    {slider.label}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-muted/50 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: slider.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-9 text-right">
                    {value}%
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. Generation Mode ──────────────────── */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Modo de Geração
          </h4>

          <div className="grid gap-3 sm:grid-cols-3">
            {MODES.map((mode) => {
              const isActive = settings.generationMode === mode.value;
              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => onUpdate({ generationMode: mode.value })}
                  className={`relative flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-primary/60 bg-primary/10 shadow-sm shadow-primary/10"
                      : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  {mode.recommended && (
                    <Badge
                      variant="default"
                      className="absolute -top-2 right-3 text-[10px] px-1.5 py-0 h-4 bg-primary/90"
                    >
                      Recomendado
                    </Badge>
                  )}
                  <span className="text-xl">{mode.emoji}</span>
                  <span className="text-sm font-semibold">{mode.title}</span>
                  <span className="text-xs text-muted-foreground leading-snug">
                    {mode.description}
                  </span>

                  {/* Active ring indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="mode-indicator"
                      className="absolute inset-0 rounded-xl ring-2 ring-primary/50 pointer-events-none"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 4. OpenAI Fallback Toggle ───────────── */}
        <section className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Motor Secundário
          </h4>

          <div
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/40 bg-muted/20 cursor-pointer transition-colors hover:bg-muted/30"
            onClick={() => onUpdate({ openAIFallback: !settings.openAIFallback })}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">OpenAI Fallback</p>
                <p className="text-xs text-muted-foreground">
                  Usar OpenAI como motor secundário quando Groq falhar
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.openAIFallback}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({ openAIFallback: !settings.openAIFallback });
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                settings.openAIFallback ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  settings.openAIFallback ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
