"use client";

import { useState } from "react";
import { Share2, Check, Link, FileText, Loader2 } from "lucide-react";

export function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1800);
    } catch {
      // fallback
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 500));
    window.print();
    setExporting(false);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Compartilhar ou Exportar"
        className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Compartilhar</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-10 right-0 w-52 bg-popover border border-border/60 rounded-xl shadow-xl p-2 z-50">
            <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
              Compartilhar
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted/70 transition-colors text-foreground"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <Link className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span>{copied ? "Link copiado!" : "Copiar link"}</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-muted/70 transition-colors text-foreground disabled:opacity-60"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span>Exportar PDF</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
