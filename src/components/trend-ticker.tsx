"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface TrendItem {
  label: string;
  change: string;
  up: boolean;
}

const FALLBACK: TrendItem[] = [
  { label: "SaaS B2B Produtividade", change: "+18%", up: true },
  { label: "Apps para TDAH", change: "+124%", up: true },
  { label: "Finanças Pessoais", change: "+31%", up: true },
  { label: "Ferramentas para Criadores", change: "+47%", up: true },
  { label: "Micro-SaaS para Médicos", change: "+89%", up: true },
  { label: "IA para Jurídico", change: "+203%", up: true },
];

export function TrendTicker() {
  const [trends, setTrends] = useState<TrendItem[]>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrends = async () => {
    try {
      const res = await fetch("/api/trends/ticker", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const json = await res.json();
      if (json.trends && json.trends.length > 0) {
        setTrends(json.trends);
        setLastUpdated(new Date());
      }
    } catch {
      // mantém fallback silenciosamente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
    // Atualiza a cada 5 minutos automaticamente
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Duplicar para loop contínuo
  const items = [...trends, ...trends];

  return (
    <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs overflow-hidden">
      {/* Indicador ao vivo */}
      <div className="flex items-center gap-1 shrink-0">
        {loading ? (
          <RefreshCw className="h-2.5 w-2.5 text-muted-foreground animate-spin" />
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
        <span
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider cursor-default"
          title={lastUpdated ? `Atualizado: ${lastUpdated.toLocaleTimeString("pt-PT")}` : "A carregar..."}
        >
          {loading ? "A carregar" : "Ao Vivo"}
        </span>
      </div>

      {/* Faixa rolante */}
      <div className="flex-1 overflow-hidden relative">
        {/* Gradientes de fade nas bordas */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />

        <div
          key={trends.length} // re-anima quando os dados mudam
          className="flex gap-6 whitespace-nowrap"
          style={{ animation: `ticker ${Math.max(20, trends.length * 4)}s linear infinite` }}
        >
          {items.map((t, i) => (
            <span
              key={`${t.label}-${i}`}
              className="inline-flex items-center gap-1 text-[11px] font-medium shrink-0"
            >
              {t.up ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span className="text-muted-foreground">{t.label}</span>
              <span className={t.up ? "text-emerald-500 font-bold" : "text-red-400 font-bold"}>
                {t.change}
              </span>
              <span className="text-border/70 mx-1">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
