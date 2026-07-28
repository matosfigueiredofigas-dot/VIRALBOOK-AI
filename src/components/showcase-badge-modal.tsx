"use client";

import { useState } from "react";
import { Copy, Check, X, Code2, ExternalLink } from "lucide-react";

interface ShowcaseBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export function ShowcaseBadgeModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: ShowcaseBadgeModalProps) {
  const [copiedType, setCopiedType] = useState<"html" | "md" | null>(null);

  if (!isOpen) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://viralbook-ai.vercel.app";
  const badgeUrl = `${baseUrl}/api/showcase/${projectId}/badge`;
  const targetUrl = `${baseUrl}/showcase`;

  const htmlCode = `<a href="${targetUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeUrl}" alt="Featured on ViralBook AI - ${projectTitle}" width="240" height="54" />
</a>`;

  const markdownCode = `[![Featured on ViralBook AI](${badgeUrl})](${targetUrl})`;

  const handleCopy = (code: string, type: "html" | "md") => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-2xl shadow-2xl p-6 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Badge de Lançamento</h2>
            <p className="text-xs text-muted-foreground">
              Adicione este badge à sua Landing Page para atrair votos da comunidade.
            </p>
          </div>
        </div>

        {/* Pré-visualização do Badge */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col items-center justify-center space-y-3">
          <span className="text-xs text-zinc-400 font-medium">Pré-visualização em Tempo Real:</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badgeUrl}
            alt={`Badge para ${projectTitle}`}
            className="h-[54px] w-[240px] rounded-xl shadow-lg border border-zinc-800"
          />
        </div>

        {/* Snippet HTML */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Código HTML (para o seu site)</span>
            <button
              onClick={() => handleCopy(htmlCode, "html")}
              className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-medium transition"
            >
              {copiedType === "html" ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar HTML
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-muted/60 border border-border rounded-xl text-xs font-mono overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {htmlCode}
          </pre>
        </div>

        {/* Snippet Markdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
            <span>Código Markdown (para o README no GitHub)</span>
            <button
              onClick={() => handleCopy(markdownCode, "md")}
              className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-400 font-medium transition"
            >
              {copiedType === "md" ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar Markdown
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-muted/60 border border-border rounded-xl text-xs font-mono overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {markdownCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
