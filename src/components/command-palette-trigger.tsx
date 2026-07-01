"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CommandPalette } from "@/components/command-palette";

export function CommandPaletteTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted/40 border border-border/50 hover:bg-muted hover:border-border text-muted-foreground hover:text-foreground transition-all group"
        aria-label="Abrir paleta de comandos"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden md:inline text-xs">Buscar...</span>
        <kbd className="hidden lg:flex items-center gap-0.5 pl-1.5 text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity">
          <span>Ctrl</span><span>+K</span>
        </kbd>
      </button>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
