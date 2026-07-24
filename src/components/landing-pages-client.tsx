"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants, Button } from "@/components/ui/button";
import { Layout, Users, Globe, ExternalLink, ArrowRight, Trash2 } from "lucide-react";

interface LandingPagesClientProps {
  landingPagesWithLeads: any[];
  totalLeads: number;
}

export function LandingPagesClient({ landingPagesWithLeads, totalLeads }: LandingPagesClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8 text-primary animate-pulse" />
            {isEn ? "Validation Pages" : isEs ? "Páginas de Validación" : "Páginas de Validação"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEn 
              ? "Manage your demand validation Landing Pages and track waitlist subscriptions." 
              : isEs 
              ? "Gestione sus Landing Pages de validación de demanda y rastree las suscripciones en la lista de espera." 
              : "Gerencie suas Landing Pages de validação de demanda e acompanhe as inscrições na lista de espera."}
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 pr-8">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalLeads}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {isEn ? "Total Captured Leads" : isEs ? "Total de Leads Capturados" : "Total de Leads Capturados"}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Grid de Páginas */}
      {landingPagesWithLeads.length === 0 ? (
        <Card className="border-white/5 bg-background/40 backdrop-blur-xl rounded-[25px] p-8 text-center">
          <CardContent className="pt-6 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {isEn ? "No Landing Pages created yet" : isEs ? "No se ha creado ninguna Landing Page" : "Nenhuma Landing Page criada ainda"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              {isEn 
                ? "Go to the SaaS Opportunities section, open an idea's details and click \"Publish Landing Page\"." 
                : isEs 
                ? "Vaya a Oportunidades SaaS, abra los detalles de una idea y haga clic en \"Publicar Landing Page\"." 
                : "Vá para a seção de SaaS Opportunities, abra os detalhes de uma ideia e clique em \"Gerar Landing Page\"!"}
            </p>
            <div className="pt-4">
              <a href="/dashboard" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 rounded-xl font-bold" })}>
                {isEn ? "View SaaS Opportunities" : isEs ? "Ver Oportunidades SaaS" : "Ver Oportunidades de SaaS"} <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPagesWithLeads.map((item: any) => (
            <Card key={item.id} className="glass-card border-white/10 hover:border-primary/40 transition-all rounded-[24px] overflow-hidden flex flex-col justify-between group">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    {item.theme}
                  </span>
                  <a
                    href={`/l/${item.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    {isEn ? "Visit Page" : isEs ? "Visitar Página" : "Visitar Página"} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                    {item.headline || item.opportunities?.saas_name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {item.subheadline}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-950/60 p-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">
                    {item.leads_count} {isEn ? "Leads" : isEs ? "Leads" : "Leads"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  /l/{item.slug}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
