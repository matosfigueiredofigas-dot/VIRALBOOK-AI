"use client";

import { useState } from "react";
import { Rocket, Loader2, ExternalLink, Users, Copy, Check, Download, Eye, TrendingUp, Palette } from "lucide-react";
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
    launchpad_views?: number | null;
  };
  initialLeads: Lead[];
}

export function LaunchpadManager({ opportunity, initialLeads }: LaunchpadManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [slug, setSlug] = useState<string | null>(opportunity.published_slug);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState("cyberpunk");

  const views = opportunity.launchpad_views || 0;
  const leadsCount = initialLeads.length;
  const conversionRate = views > 0 ? ((leadsCount / views) * 100).toFixed(1) : "0.0";

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
          theme: theme
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

  const handleExportCSV = () => {
    if (initialLeads.length === 0) {
      alert("Nenhum lead para exportar.");
      return;
    }
    const headers = "ID,Email,Data\n";
    const rows = initialLeads.map(l => `${l.id},${l.email},${new Date(l.created_at).toISOString()}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${slug || "launchpad"}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div id="launchpad" className="mt-12 border-t border-gray-200 pt-12 print:hidden scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900">
            <Rocket className="h-8 w-8 text-indigo-600" />
            1-Click Launchpad
          </h2>
          <p className="text-gray-600 mt-1">Publique sua Landing Page instantaneamente e acompanhe os Leads em tempo real.</p>
        </div>

        {!slug && (
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border">
            <div className="flex items-center gap-2 pl-2">
              <Palette className="h-4 w-4 text-gray-500" />
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="cyberpunk">Cyberpunk (Dark)</option>
                <option value="minimalist">Minimalista (Apple)</option>
                <option value="corporate">Corporativo (B2B)</option>
              </select>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 rounded-lg">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...</>
              ) : (
                <><Rocket className="mr-2 h-4 w-4" /> Publicar Landing Page</>
              )}
            </Button>
          </div>
        )}
      </div>

      {slug && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Painel Esquerdo: Iframe e Ações */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-emerald-600 flex items-center gap-2">
                  <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  Status: Online
                </h3>
                <div className="flex items-center gap-2">
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none"
                  >
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="minimalist">Minimalista</option>
                    <option value="corporate">Corporativo</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading} className="text-xs h-8">
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Regerar Design"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                <a 
                  href={`/p/${slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 bg-white border border-gray-200 py-2 px-3 text-sm font-mono text-indigo-600 hover:underline truncate rounded-lg"
                >
                  {typeof window !== 'undefined' ? window.location.origin : ''}/p/{slug}
                </a>
                <Button variant="ghost" size="icon" onClick={handleCopy} className="text-gray-500 hover:text-indigo-600">
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </Button>
                <a href={`/p/${slug}`} target="_blank" rel="noreferrer" className="flex shrink-0">
                  <Button variant="default" className="bg-black text-white hover:bg-gray-800 rounded-lg">
                    <ExternalLink className="h-4 w-4 mr-2" /> Visitar
                  </Button>
                </a>
              </div>

              {/* Iframe Live Preview */}
              <div className="relative mt-2 border border-gray-200 rounded-xl overflow-hidden bg-gray-100 aspect-video shadow-inner flex flex-col">
                <div className="bg-gray-200/50 border-b border-gray-200 h-8 flex items-center px-4 gap-2 shrink-0">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-[10px] text-gray-400 font-mono flex-1 text-center pr-10 truncate">
                    {typeof window !== 'undefined' ? window.location.host : ''}/p/{slug}
                  </div>
                </div>
                <iframe 
                  src={`/p/${slug}`} 
                  className="w-full h-full border-none flex-1 bg-white"
                  title="Live Preview"
                />
              </div>

            </div>
          </div>

          {/* Painel Direito: Analytics & Leads */}
          <div className="flex flex-col gap-6">
            
            {/* Analytics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Visitas</span>
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-3xl font-black text-gray-900">{views}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Conversão</span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-gray-900">{conversionRate}%</div>
              </div>
            </div>

            {/* Leads List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col flex-1 max-h-[500px]">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <Users className="h-5 w-5 text-indigo-500" /> 
                  Leads ({leadsCount})
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportCSV}
                  disabled={leadsCount === 0}
                  className="text-xs h-8 gap-1.5 border-gray-200"
                >
                  <Download className="h-3 w-3" /> Exportar CSV
                </Button>
              </div>
              
              {leadsCount === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Users className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Nenhum lead capturado</p>
                  <p className="text-xs text-gray-400 mt-1">Divulgue o seu link para começar.</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar space-y-2">
                  {initialLeads.map(lead => (
                    <div key={lead.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {lead.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm text-gray-700 truncate">{lead.email}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap ml-2">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
