"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Sun,
  Moon,
  Cpu,
  Sparkles,
  Coffee,
  Maximize2,
  Minimize2,
  Zap,
} from "lucide-react";
import type { AppearanceSettings } from "@/hooks/use-settings";

// ============================================================
// Theme definitions with preview colors
// ============================================================

const themes = [
  {
    id: "light",
    name: "Claro",
    icon: Sun,
    accent: "#f59e0b",       // amber-500
    bg: "#ffffff",
    card: "#f8fafc",
    primary: "#f59e0b",
    ring: "ring-amber-400/60",
  },
  {
    id: "dark",
    name: "Escuro",
    icon: Moon,
    accent: "#64748b",       // slate-500
    bg: "#0f172a",
    card: "#1e293b",
    primary: "#64748b",
    ring: "ring-slate-400/60",
  },
  {
    id: "tech-ai",
    name: "Tech & AI",
    icon: Cpu,
    accent: "#06b6d4",       // cyan-500
    bg: "#0c1222",
    card: "#131d33",
    primary: "#06b6d4",
    ring: "ring-cyan-400/60",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    icon: Sparkles,
    accent: "#d946ef",       // fuchsia-500
    bg: "#110a1a",
    card: "#1a1025",
    primary: "#d946ef",
    ring: "ring-fuchsia-400/60",
  },
  {
    id: "retro",
    name: "Retro Sepia",
    icon: Coffee,
    accent: "#b45309",       // amber-700
    bg: "#faf5eb",
    card: "#f5edd6",
    primary: "#b45309",
    ring: "ring-amber-700/60",
  },
] as const;

// ============================================================
// Density options
// ============================================================

const densityOptions: {
  value: AppearanceSettings["density"];
  label: string;
  icon: typeof Minimize2;
}[] = [
  { value: "compact", label: "Compacta", icon: Minimize2 },
  { value: "comfortable", label: "Confortável", icon: Maximize2 },
  { value: "spacious", label: "Espaçosa", icon: Maximize2 },
];

// ============================================================
// Component
// ============================================================

interface Props {
  settings: AppearanceSettings;
  onUpdate: (updates: Partial<AppearanceSettings>) => void;
}

export function SettingsAppearance({ settings, onUpdate }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card overflow-hidden rounded-2xl border border-border/40"
    >
      {/* ── Gradient header ── */}
      <div className="relative flex items-center gap-3 px-6 py-5 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border-b border-border/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-sm">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground tracking-tight">
            Personalização Visual
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tema, densidade e animações da interface
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* ── 1. Theme Selector ── */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-foreground">
              Tema da Interface
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Escolha a aparência que combina com o seu estilo
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = mounted && theme === t.id;

              return (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(t.id)}
                  className={`
                    group relative flex flex-col items-center gap-2.5 p-4 rounded-xl
                    border transition-all duration-200 cursor-pointer text-left
                    ${
                      isActive
                        ? `ring-2 ${t.ring} border-primary/50 bg-primary/5 shadow-lg shadow-primary/10`
                        : "border-border/40 bg-card/50 hover:border-border/70 hover:bg-card/80"
                    }
                  `}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="theme-active-dot"
                      className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}

                  {/* Color preview rectangle */}
                  <div
                    className="w-full h-12 rounded-lg overflow-hidden border border-border/20 shadow-inner"
                    style={{ backgroundColor: t.bg }}
                  >
                    <div className="flex h-full items-end p-1.5 gap-1">
                      {/* Mini card */}
                      <div
                        className="flex-1 h-6 rounded-sm"
                        style={{ backgroundColor: t.card }}
                      />
                      {/* Primary accent bar */}
                      <div
                        className="w-3 h-full rounded-sm"
                        style={{ backgroundColor: t.primary }}
                      />
                    </div>
                  </div>

                  {/* Icon + Name */}
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full shrink-0"
                      style={{ backgroundColor: `${t.accent}22` }}
                    >
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: t.accent }}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive
                          ? "text-primary"
                          : "text-foreground/80 group-hover:text-foreground"
                      }`}
                    >
                      {t.name}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border/30" />

        {/* ── 2. Interface Density ── */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-foreground">
              Densidade da Interface
            </label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Controle o espaçamento entre os elementos
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-border/40 bg-muted/30 p-1 gap-1">
            {densityOptions.map((opt) => {
              const isActive = settings.density === opt.value;
              const DIcon = opt.icon;

              return (
                <button
                  key={opt.value}
                  onClick={() => onUpdate({ density: opt.value })}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
                    transition-all duration-200 cursor-pointer select-none
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  <DIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{opt.label}</span>
                  <span className="sm:hidden">{opt.label.slice(0, 4)}.</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-border/30" />

        {/* ── 3. Animations Toggle ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">
                  Animações
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ativar transições e efeitos visuais animados
                </p>
              </div>
            </div>

            {/* Custom toggle switch */}
            <button
              role="switch"
              aria-checked={settings.animationsEnabled}
              onClick={() =>
                onUpdate({ animationsEnabled: !settings.animationsEnabled })
              }
              className={`
                relative inline-flex h-7 w-12 shrink-0 items-center rounded-full
                border-2 transition-colors duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
                ${
                  settings.animationsEnabled
                    ? "bg-primary border-primary"
                    : "bg-muted border-border/50"
                }
              `}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                  pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg
                  transform transition-colors duration-200
                  ${
                    settings.animationsEnabled
                      ? "bg-primary-foreground translate-x-5"
                      : "bg-foreground/60 translate-x-0.5"
                  }
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
