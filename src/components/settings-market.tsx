"use client";

import { motion } from "framer-motion";
import { Globe, Calendar, Languages, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { MarketSettings } from "@/hooks/use-settings";

// ─── Data ────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "ALL", flag: "🌍", name: "Todos os Países" },
  { code: "BR", flag: "🇧🇷", name: "Brasil" },
  { code: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "AO", flag: "🇦🇴", name: "Angola" },
  { code: "MZ", flag: "🇲🇿", name: "Moçambique" },
  { code: "US", flag: "🇺🇸", name: "United States" },
  { code: "UK", flag: "🇬🇧", name: "United Kingdom" },
  { code: "ES", flag: "🇪🇸", name: "España" },
  { code: "FR", flag: "🇫🇷", name: "France" },
  { code: "DE", flag: "🇩🇪", name: "Deutschland" },
] as const;

const PERIODS: { value: MarketSettings["defaultPeriod"]; label: string }[] = [
  { value: "now", label: "Agora (1h)" },
  { value: "7d", label: "7 Dias" },
  { value: "30d", label: "30 Dias" },
  { value: "90d", label: "90 Dias" },
  { value: "all", label: "Todo o Período" },
];

const LANGUAGES: {
  value: MarketSettings["aiOutputLanguage"];
  flag: string;
  label: string;
}[] = [
  { value: "pt", flag: "🇧🇷", label: "Português" },
  { value: "en", flag: "🇺🇸", label: "English" },
  { value: "es", flag: "🇪🇸", label: "Español" },
  { value: "fr", flag: "🇫🇷", label: "Français" },
];

function getScoreLabel(value: number) {
  if (value >= 80) return "Apenas Premium";
  if (value >= 50) return "Apenas Relevantes";
  return "Mostrar Todas";
}

// ─── Props ───────────────────────────────────────────────────

interface Props {
  settings: MarketSettings;
  onUpdate: (updates: Partial<MarketSettings>) => void;
}

// ─── Component ───────────────────────────────────────────────

export function SettingsMarket({ settings, onUpdate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl"
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
          <Globe className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Mercado & Região
          </h3>
          <p className="text-xs text-muted-foreground">
            Preferências geográficas e linguísticas
          </p>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-6">
        {/* 1 ▸ Default Country */}
        <SettingsRow
          icon={<Globe className="h-4 w-4" />}
          label="País Padrão"
          description="País utilizado como padrão nas análises"
        >
          <Select
            value={settings.defaultCountry}
            onValueChange={(val) =>
              onUpdate({ defaultCountry: val ?? settings.defaultCountry })
            }
          >
            <SelectTrigger className="w-[220px] bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent className="bg-background/90 backdrop-blur-xl border-white/10">
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="mr-1.5">{c.flag}</span>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsRow>

        {/* 2 ▸ Default Period */}
        <SettingsRow
          icon={<Calendar className="h-4 w-4" />}
          label="Período de Análise Padrão"
          description="Janela temporal padrão para todas as análises"
        >
          <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onUpdate({ defaultPeriod: p.value })}
                className={`
                  relative rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200
                  ${
                    settings.defaultPeriod === p.value
                      ? "bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {p.label}
              </button>
            ))}
          </div>
        </SettingsRow>

        {/* 3 ▸ AI Output Language */}
        <SettingsRow
          icon={<Languages className="h-4 w-4" />}
          label="Idioma de Saída da IA"
          description="Idioma em que a IA gera respostas e relatórios"
        >
          <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
            {LANGUAGES.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => onUpdate({ aiOutputLanguage: l.value })}
                className={`
                  relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200
                  ${
                    settings.aiOutputLanguage === l.value
                      ? "bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10 border border-emerald-500/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                <span>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </SettingsRow>

        {/* 4 ▸ Minimum Score Display */}
        <SettingsRow
          icon={<Filter className="h-4 w-4" />}
          label="Pontuação Mínima Exibida"
          description="Filtro de qualidade para os resultados apresentados"
        >
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={settings.minScoreDisplay}
                onChange={(e) =>
                  onUpdate({ minScoreDisplay: Number(e.target.value) })
                }
                className="
                  w-full h-2 appearance-none rounded-full bg-white/10 cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-emerald-400
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:shadow-emerald-500/30
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-emerald-300
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:scale-125
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-emerald-400
                  [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-emerald-300
                  [&::-moz-range-thumb]:shadow-md
                "
              />
            </div>

            {/* Labels row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">0</span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 font-mono tabular-nums"
                >
                  {settings.minScoreDisplay}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {getScoreLabel(settings.minScoreDisplay)}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">100</span>
            </div>

            {/* Tick marks */}
            <div className="flex items-center justify-between px-0.5">
              {[0, 50, 80].map((tick) => (
                <button
                  key={tick}
                  type="button"
                  onClick={() => onUpdate({ minScoreDisplay: tick })}
                  className={`
                    text-[10px] px-1.5 py-0.5 rounded-md transition-colors
                    ${
                      settings.minScoreDisplay === tick
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }
                  `}
                >
                  {tick === 0
                    ? "Mostrar Todas"
                    : tick === 50
                      ? "Relevantes"
                      : "Premium"}
                </button>
              ))}
            </div>
          </div>
        </SettingsRow>
      </div>
    </motion.div>
  );
}

// ─── Reusable Row ────────────────────────────────────────────

function SettingsRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="sm:shrink-0">{children}</div>
    </div>
  );
}
