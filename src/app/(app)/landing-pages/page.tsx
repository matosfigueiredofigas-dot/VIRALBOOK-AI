import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Globe, Mail, ExternalLink, Calendar, Copy, Layout, Users, FileText, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LeadsManager } from "@/components/leads-manager";
import { CopyButton } from "@/components/copy-button";
import { getFilterDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function LandingPagesDashboard(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  // 1. Carregar as Landing Pages do usuário
  let query = supabase
    .from('landing_pages')
    .select('*, opportunities(saas_name, problem_solved, country)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: lps, error } = await query;

  if (error) {
    console.error("Erro ao buscar landing pages:", error);
  }

  // 2. Buscar a contagem de leads de cada uma e montar os resultados
  let filteredLps = lps || [];
  if (country !== "ALL") {
    filteredLps = filteredLps.filter((lp: any) => lp.opportunities?.country === country);
  }

  const landingPagesWithLeads = await Promise.all(
    filteredLps.map(async (lp: any) => {
      // Obter contagem
      const { count } = await supabase
        .from('waitlist_leads')
        .select('*', { count: 'exact', head: true })
        .eq('landing_page_id', lp.id);

      // Obter lista de e-mails para visualização/exportação
      const { data: leads } = await supabase
        .from('waitlist_leads')
        .select('id, email, created_at')
        .eq('landing_page_id', lp.id)
        .order('created_at', { ascending: false });

      return {
        ...lp,
        leadsCount: count || 0,
        leads: leads || []
      };
    })
  );

  // Métrica consolidada
  const totalLeads = landingPagesWithLeads.reduce((acc, curr) => acc + curr.leadsCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Layout className="h-8 w-8 text-primary animate-pulse" />
            Páginas de Validação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas Landing Pages de validação de demanda e acompanhe as inscrições na lista de espera.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 pr-8">
          <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalLeads}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total de Leads Capturados</div>
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
            <h3 className="text-xl font-bold text-white">Nenhuma Landing Page criada ainda</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Vá para a seção de <strong className="text-foreground">SaaS Opportunities</strong>, abra os detalhes de uma ideia e clique em <strong className="text-foreground">"Gerar Landing Page"</strong> para criar sua primeira página de vendas automática!
            </p>
            <div className="pt-4">
              <a href="/opportunities" className={buttonVariants({ className: "bg-primary hover:bg-primary/90 rounded-xl font-bold" })}>
                Ver Oportunidades de SaaS <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {landingPagesWithLeads.map((lp) => (
            <Card 
              key={lp.id} 
              className="border-white/5 bg-background/50 backdrop-blur-md rounded-[25px] flex flex-col justify-between overflow-hidden relative group hover:border-white/10 transition-all duration-300"
            >
              <div 
                className="absolute top-0 w-full h-1" 
                style={{ backgroundColor: lp.theme_color }} 
              />
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400 text-xs">
                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                    {new Date(lp.created_at).toLocaleDateString('pt-BR')}
                  </Badge>
                  <div className="flex gap-2">
                    <div className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-white" })} title="Copiar URL Pública">
                      <CopyButton text={`${typeof window !== 'undefined' ? window.location.origin : ''}/l/${lp.slug}`} />
                    </div>
                    <a 
                      href={`/l/${lp.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-primary" })}
                      title="Abrir Landing Page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <CardTitle className="text-xl font-black text-white">
                  {lp.opportunities?.saas_name || 'SaaS sem nome'}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {lp.headline}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-9 w-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${lp.theme_color}15`, color: lp.theme_color }}
                    >
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Lista de Espera</div>
                      <div className="text-xs text-muted-foreground">Contatos registrados</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">{lp.leadsCount}</div>
                </div>

                <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  <strong className="text-zinc-400">Dores da Oportunidade:</strong> {lp.opportunities?.problem_solved}
                </div>
              </CardContent>

              <div className="p-4 bg-zinc-950/20 border-t border-white/5 flex gap-2">
                <LeadsManager 
                  leads={lp.leads} 
                  saasName={lp.opportunities?.saas_name} 
                  landingPageUrl={`/l/${lp.slug}`}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

