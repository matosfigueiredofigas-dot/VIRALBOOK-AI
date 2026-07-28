"use client";

import { Trophy, Flame, ExternalLink, Award } from "lucide-react";
import Image from "next/image";

interface LeaderboardProject {
  id: string;
  title: string;
  tagline: string;
  url: string;
  category: string;
  upvotes_count: number;
  screenshot_url?: string;
  has_voted?: boolean;
}

interface ShowcaseWeeklyLeaderboardProps {
  topProjects: LeaderboardProject[];
  onUpvote: (id: string, currentHasVoted: boolean) => void;
}

export function ShowcaseWeeklyLeaderboard({
  topProjects,
  onUpvote,
}: ShowcaseWeeklyLeaderboardProps) {
  if (!topProjects || topProjects.length === 0) return null;

  const ranks = [
    { rank: 1, color: "from-amber-500/20 via-yellow-500/10 to-transparent", border: "border-amber-500/40", iconColor: "text-amber-400", badge: "🥇 1º Lugar" },
    { rank: 2, color: "from-slate-400/20 via-zinc-400/10 to-transparent", border: "border-slate-400/40", iconColor: "text-slate-300", badge: "🥈 2º Lugar" },
    { rank: 3, color: "from-amber-700/20 via-amber-800/10 to-transparent", border: "border-amber-700/40", iconColor: "text-amber-600", badge: "🥉 3º Lugar" },
  ];

  return (
    <div className="p-6 bg-gradient-to-r from-amber-950/20 via-zinc-900/50 to-amber-950/20 border border-amber-500/20 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              App da Semana <span className="text-xs font-normal text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">🏆 Top 3 da Comunidade</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Os projetos com maior destaque e votos nos últimos 7 dias.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topProjects.slice(0, 3).map((project, idx) => {
          const config = ranks[idx] || ranks[2];
          return (
            <div
              key={project.id}
              className={`relative p-4 rounded-xl border ${config.border} bg-gradient-to-b ${config.color} backdrop-blur-sm space-y-3 flex flex-col justify-between hover:scale-[1.01] transition duration-200`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-background/80 border ${config.border} ${config.iconColor}`}>
                    {config.badge}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    {project.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">
                    {project.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {project.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <button
                  onClick={() => onUpvote(project.id, !!project.has_voted)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    project.has_voted
                      ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                      : "bg-muted/80 hover:bg-muted text-foreground"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{project.upvotes_count}</span>
                </button>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  Visitar <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
