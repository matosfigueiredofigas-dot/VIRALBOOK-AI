"use client";

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut, ChevronDown, Shield, PlayCircle } from "lucide-react";
import { startTutorial } from "@/components/tutorial-provider";
import { LanguageToggle } from "@/components/language-toggle";

interface UserNavProps {
  email: string;
  isAdmin?: boolean;
}

export function UserNav({ email, isAdmin = false }: UserNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = email
    ? email
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase()
    : "?";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border border-border/50 bg-muted/40 hover:bg-muted hover:border-border transition-all group"
        aria-label="Menu do utilizador"
      >
        {/* Avatar */}
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-primary/30">
          {initials}
        </div>
        <span className="text-xs font-medium text-foreground/80 hidden sm:block max-w-[100px] truncate">
          {email?.split("@")[0]}
        </span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-11 right-0 w-56 bg-popover border border-border/60 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User info header */}
          <div className="px-3 py-3 border-b border-border/40 bg-muted/20">
            <p className="text-xs font-bold text-foreground truncate">{email?.split("@")[0]}</p>
            <p className="text-[10px] text-muted-foreground truncate">{email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-amber-500/15 text-amber-500 text-[9px] font-bold rounded-full border border-amber-500/20">
                <Shield className="h-2.5 w-2.5" /> Admin
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="p-1">
            <a
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted/70 transition-colors text-foreground"
            >
              <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
              Configurações
            </a>

            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-muted/70 transition-colors text-foreground">
              <span className="text-xs font-medium text-muted-foreground">Idioma</span>
              <LanguageToggle />
            </div>

            <button
              onClick={() => {
                setOpen(false);
                startTutorial();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted/70 transition-colors text-foreground text-left"
            >
              <PlayCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              Refazer Tutorial
            </button>

            {isAdmin && (
              <a
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-amber-500/10 transition-colors text-amber-500"
              >
                <Shield className="h-4 w-4 shrink-0" />
                Painel Admin
              </a>
            )}

            <div className="h-px bg-border/40 my-1" />

            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors text-red-500"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sair da Conta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
