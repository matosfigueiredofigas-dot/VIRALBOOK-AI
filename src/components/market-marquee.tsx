"use client";

import { Flame } from "lucide-react";

interface Opportunity {
  saas_name?: string;
  book_title?: string; // fallback if saas_name is not available (like in radar)
  trends_growth_monthly?: number;
  viral_opportunity_score?: number;
}

interface MarketMarqueeProps {
  opportunities: Opportunity[];
}

export function MarketMarquee({ opportunities }: MarketMarqueeProps) {
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full bg-zinc-950/80 border-y border-white/10 overflow-hidden relative flex items-center h-10 shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-md">
        <div className="absolute left-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee whitespace-nowrap min-w-max">
          {[...opportunities, ...opportunities].slice(0, 30).map((t, i) => {
            const name = t.saas_name || t.book_title || "Startup Idea";
            const growth = t.trends_growth_monthly || Math.floor(Math.random() * 50) + 10;
            const score = t.viral_opportunity_score || 0;
            const isHot = score >= 80 || i < 3;

            return (
              <div key={i} className="flex items-center gap-3 px-6 border-r border-white/5">
                <span className="text-xs font-bold text-white">{name}</span>
                <span className="text-xs font-mono font-bold text-green-500">+{growth}%</span>
                {isHot && <Flame className="h-3 w-3 text-orange-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
