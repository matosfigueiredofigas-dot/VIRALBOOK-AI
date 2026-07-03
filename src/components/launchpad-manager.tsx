"use client";

import { useState } from "react";
import { Rocket, Loader2, ExternalLink, Users, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  email: string;
  created_at: string;
}

interface LaunchpadManagerProps {
  opportunity: {
    id: string;
    saas_name: string;
    problem_solved: string;
    target_audience: string;
    mvp_features: string;
    published_slug: string | null;
  };
  initialLeads: Lead[];
}

export function LaunchpadManager({ opportunity, initialLeads }: LaunchpadManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState<string | null>(opportunity.published_slug);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/opportunities/launchpad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          saasName: opportunity.saas_name,
          problem: opportunity.problem_solved,
          audience: opportunity.target_audience,
          features: opportunity.mvp_features,
        })
      });
      
      const data = await res.json();
      if (res.ok && data.slug) {
        setSlug(data.slug);
      } else {
        alert("Erro: " + (data.error || "Falha ao gerar Landing Page"));
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (slug) {
      const url = `${window.location.origin}/p/${slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 border-t-2 border-black pt-8 print:hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-indigo-600" />
            1-Click Launchpad
          </h2>
          <p className="text-gray-600">Publique uma Landing Page de captura de Leads instantaneamente.</p>
        </div>
        {!slug && (
          <Button onClick={handleGenerate} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Página...</>
            ) : (
              <><Rocket className="mr-2 h-4 w-4" /> Publicar Landing Page</>
            )}
          </Button>
        )}
      </div>

      {slug && (
        <div className="bg-zinc-50 border-2 border-black p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-emerald-600 flex items-center gap-2">
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                Página Online
              </h3>
              <p className="text-sm text-gray-600 mb-4">Sua Landing Page foi gerada e já está hospedada publicamente no link abaixo.</p>
              
              <div className="flex items-center gap-2">
                <a 
                  href={`/p/${slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-white border border-gray-300 p-2 text-sm font-mono text-blue-600 hover:underline truncate"
                >
                  {typeof window !== 'undefined' ? window.location.origin : ''}/p/{slug}
                </a>
                <Button variant="outline" onClick={handleCopy} className="border-black shrink-0">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <a href={`/p/${slug}`} target="_blank" rel="noreferrer" className="flex shrink-0">
                  <Button variant="default" className="bg-black text-white w-full">
                    <ExternalLink className="h-4 w-4 mr-2" /> Abrir
                  </Button>
                </a>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleGenerate} disabled={isLoading} className="text-xs">
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Rocket className="h-3 w-3 mr-2" />}
                  Regerar Design da Página
                </Button>
              </div>
            </div>

            <div className="flex-1 border-l-2 border-black pl-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Users className="h-5 w-5" /> Leads Capturados ({initialLeads.length})
              </h3>
              
              {initialLeads.length === 0 ? (
                <div className="bg-gray-100 p-4 text-sm text-gray-500 text-center">
                  Nenhum lead capturado ainda. Divulgue o seu link!
                </div>
              ) : (
                <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {initialLeads.map(lead => (
                    <li key={lead.id} className="flex justify-between items-center text-sm p-2 bg-white border border-gray-200 shadow-sm">
                      <span className="font-medium">{lead.email}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
