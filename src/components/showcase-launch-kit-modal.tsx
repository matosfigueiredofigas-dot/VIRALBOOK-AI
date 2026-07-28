"use client";

import { useState, useEffect } from "react";
import { Sparkles, Copy, Check, X, Loader2, Share2 } from "lucide-react";

interface ShowcaseLaunchKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
}

export function ShowcaseLaunchKitModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: ShowcaseLaunchKitModalProps) {
  const [activeTab, setActiveTab] = useState<"twitter" | "linkedin" | "productHunt">("twitter");
  const [loading, setLoading] = useState(false);
  const [kitData, setKitData] = useState<{ twitter: string; linkedin: string; productHunt: string } | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !kitData && !loading) {
      generateKit();
    }
  }, [isOpen]);

  const generateKit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/showcase/${projectId}/launch-kit`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Erro ao gerar conteúdo");
      const data = await res.json();
      setKitData(data);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative space-y-6 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Kit de Lançamento Viral (IA)</h2>
            <p className="text-xs text-muted-foreground">
              Posts otimizados por IA para promover <span className="font-semibold text-foreground">{projectTitle}</span> nas redes sociais.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              A criar estratégia viral para X, LinkedIn e Product Hunt...
            </p>
          </div>
        ) : error ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button
              onClick={generateKit}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-semibold hover:bg-muted/80 transition"
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border-b border-border gap-2">
              <button
                onClick={() => setActiveTab("twitter")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === "twitter"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                𝕏 / Twitter
              </button>
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === "linkedin"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                💼 LinkedIn
              </button>
              <button
                onClick={() => setActiveTab("productHunt")}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === "productHunt"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                🚀 Product Hunt / Reddit
              </button>
            </div>

            {/* Conteúdo do Tab */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="relative">
                <textarea
                  readOnly
                  value={kitData?.[activeTab] || ""}
                  rows={10}
                  className="w-full p-4 bg-muted/40 border border-border rounded-xl text-xs font-mono leading-relaxed text-foreground resize-none focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center">
              <button
                onClick={generateKit}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Regenerar com IA
              </button>

              <button
                onClick={() => handleCopy(kitData?.[activeTab] || "", activeTab)}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-500/25"
              >
                {copiedTab === activeTab ? (
                  <>
                    <Check className="w-4 h-4" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copiar Texto Otimizado
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
