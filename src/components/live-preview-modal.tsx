"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PlayCircle, X, Code, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LivePreviewModalProps {
  opportunity: {
    saas_name: string;
    problem_solved: string;
    target_audience: string;
    mvp_features: string;
  };
}

export function LivePreviewModal({ opportunity }: LivePreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePreview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsOpen(true);

      const response = await fetch('/api/opportunities/live-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saasName: opportunity.saas_name,
          problem: opportunity.problem_solved,
          audience: opportunity.target_audience,
          features: opportunity.mvp_features,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar o preview.');
      }

      setHtmlCode(data.html);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (htmlCode) {
      navigator.clipboard.writeText(htmlCode);
      alert("Código HTML copiado para a área de transferência!");
    }
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full h-full flex flex-col">
        
        {/* Toolbar superior */}
        <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <PlayCircle className="h-5 w-5 text-blue-400" />
            <h3 className="text-zinc-100 font-semibold tracking-tight">
              Live Preview: <span className="text-blue-400">{opportunity.saas_name}</span>
            </h3>
            {isLoading && (
              <span className="flex items-center gap-2 text-xs text-zinc-400 ml-4 bg-zinc-800 px-3 py-1 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin" /> IA Codificando MVP...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {htmlCode && !isLoading && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-zinc-300 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white">
                <Code className="h-4 w-4 mr-2" />
                Copiar Código Fonte
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Container do Iframe */}
        <div className="flex-1 bg-white relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white z-10">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-500/40 animate-pulse mb-6">
                <Wand2 className="h-10 w-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-bold mb-2">Engenharia Reversa Ativada</h4>
              <p className="text-zinc-400 text-sm max-w-sm text-center animate-pulse">
                O modelo Llama 3.3 70B está escrevendo o HTML + Tailwind da sua dashboard em tempo real...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-red-400 p-6 text-center z-10">
              <X className="h-12 w-12 mx-auto mb-4" />
              <p className="text-xl font-bold">Erro ao gerar a interface.</p>
              <p className="text-md opacity-80 mt-2 max-w-md">{error}</p>
              <Button variant="outline" className="mt-6 border-red-800 bg-red-950 text-red-300 hover:bg-red-900 hover:text-white" onClick={() => setIsOpen(false)}>
                Fechar e tentar novamente
              </Button>
            </div>
          )}

          {htmlCode && !isLoading && !error && (
            <iframe 
              srcDoc={htmlCode} 
              className="w-full h-full border-none bg-white animate-in zoom-in-95 duration-500" 
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button 
        onClick={generatePreview}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 font-bold"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Gerar Live Preview (UI)
      </Button>

      {mounted && typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </>
  );
}
