import { createClient, getCachedUser } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { LandingPagesClient } from "@/components/landing-pages-client";

export const dynamic = "force-dynamic";

export default async function LandingPagesPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const adminSupabase = createAdminClient();

  // 1. Tentar buscar da tabela principal landing_pages
  let { data: landingPages, error } = await adminSupabase
    .from("landing_pages")
    .select(`
      *,
      opportunities (
        saas_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // 2. Se não encontrar, tentar da tabelaLegada opportunity_landing_pages
  if (!landingPages || landingPages.length === 0) {
    const { data: altLps } = await adminSupabase
      .from("opportunity_landing_pages")
      .select(`
        *,
        opportunities (
          saas_name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (altLps) {
      landingPages = altLps;
    }
  }

  if (error && (!landingPages || landingPages.length === 0)) {
    console.error("Erro ao buscar landing pages:", error);
  }

  // 3. Buscar leads capturados nas landing pages do usuário
  const { data: leads } = await adminSupabase
    .from("waitlist_leads")
    .select("landing_page_id")
    .eq("user_id", user.id);

  const leadsByPage: Record<string, number> = {};
  leads?.forEach((l: any) => {
    if (l.landing_page_id) {
      leadsByPage[l.landing_page_id] = (leadsByPage[l.landing_page_id] || 0) + 1;
    }
  });

  const landingPagesWithLeads = (landingPages || []).map((lp: any) => ({
    ...lp,
    saas_name: lp.opportunities?.saas_name || lp.headline || "Micro-SaaS",
    leads_count: leadsByPage[lp.id] || 0,
  }));

  const totalLeads = leads?.length || 0;

  return (
    <LandingPagesClient 
      landingPagesWithLeads={landingPagesWithLeads} 
      totalLeads={totalLeads} 
    />
  );
}
