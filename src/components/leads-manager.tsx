"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Mail, Download, Users, Copy, Check, ExternalLink, Sparkles } from "lucide-react";

interface Lead {
  id: string;
  email: string;
  created_at: string;
}

interface LeadsManagerProps {
  leads: Lead[];
  saasName: string;
  landingPageUrl: string;
}

export function LeadsManager({ leads, saasName, landingPageUrl }: LeadsManagerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    if (leads.length === 0) return;
    const emailsString = leads.map(l => l.email).join("\n");
    navigator.clipboard.writeText(emailsString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Data de Inscricao\n"
      + leads.map(l => `"${l.email}","${new Date(l.created_at).toLocaleString('pt-BR')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `waitlist_leads_${saasName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold h-11">
          <Users className="mr-2 h-4 w-4" /> Ver Leads ({leads.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto flex flex-col h-full bg-zinc-950 text-white border-zinc-900">
        <SheetHeader className="pb-4 border-b border-zinc-900">
          <SheetTitle className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Leads: {saasName}
          </SheetTitle>
          <SheetDescription className="text-zinc-400 text-sm">
            Visualize ou exporte as pessoas inscritas na lista de espera.
          </SheetDescription>
        </SheetHeader>

        {leads.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-white">Nenhum lead ainda</h4>
            <p className="text-xs text-zinc-400 max-w-xs">
              Divulgue o link da sua Landing Page para começar a receber inscrições!
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white" asChild>
                <a href={landingPageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  Abrir Página <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col space-y-4 pt-4 min-h-0">
            {/* Ações de Lote */}
            <div className="flex gap-2">
              <Button 
                onClick={handleCopyAll}
                variant="outline" 
                className="flex-1 border-zinc-800 text-zinc-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 font-bold h-10 rounded-xl"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" /> Copiar Lista
                  </>
                )}
              </Button>
              <Button 
                onClick={handleExportCSV}
                variant="outline" 
                className="flex-grow-0 border-zinc-800 text-zinc-300 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 font-bold h-10 rounded-xl px-3"
                title="Exportar CSV"
              >
                <Download className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Lista com scroll */}
            <div className="flex-grow border border-zinc-900 rounded-xl bg-zinc-950/50 p-2 min-h-0 overflow-y-auto max-h-[60vh] pr-2">
              <div className="space-y-2">
                {leads.map((lead, idx) => (
                  <div 
                    key={lead.id} 
                    className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-900/30 flex items-center justify-between text-xs"
                  >
                    <div className="font-semibold text-zinc-200 truncate pr-2" title={lead.email}>
                      {lead.email}
                    </div>
                    <div className="text-zinc-500 shrink-0">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
