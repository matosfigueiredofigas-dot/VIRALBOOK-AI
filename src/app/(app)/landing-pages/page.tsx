import { createClient, getCachedUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LandingPagesClient } from "@/components/landing-pages-client";

export const dynamic = "force-dynamic";

export default async function LandingPagesPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data: landingPages, error } = await supabase
    .from("opportunity_landing_pages")
    .select(`
      *,
      opportunities (
        saas_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar landing pages:", error);
  }

  const { data: leads } = await supabase
    .from("opportunity_leads")
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
