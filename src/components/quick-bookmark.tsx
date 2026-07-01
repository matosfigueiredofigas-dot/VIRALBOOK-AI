"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

export function QuickBookmark() {
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show on pages where saving makes sense
  const showOnPaths = ["/opportunities", "/library", "/radar", "/niches", "/trends", "/advisors"];
  const shouldShow = showOnPaths.some((p) => pathname.startsWith(p));

  if (!shouldShow) return null;

  const handleSave = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 800)); // simulate save
    setSaved(true);
    setLoading(false);
    // Auto-reset after 2.5s
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading || saved}
      title="Salvar tela atual nos Favoritos"
      className={`
        relative flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium border transition-all duration-300
        ${saved
          ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
          : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border"
        }
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="h-3.5 w-3.5 text-rose-500" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">
        {saved ? "Salvo!" : "Favoritar"}
      </span>
    </button>
  );
}
