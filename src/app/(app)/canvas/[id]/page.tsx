import { createClient, getCachedUser } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { CanvasClient } from "@/components/canvas-client"
import { getSocialMetrics } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function CanvasPage(props: { params: Promise<{ id: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const params = await props.params;

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  const metrics = getSocialMetrics(opportunity);

  const { data: initialLeads } = await supabase
    .from('opportunity_leads')
    .select('*')
    .eq('opportunity_id', opportunity.id)
    .order('created_at', { ascending: false });

  return (
    <CanvasClient 
      opportunity={opportunity} 
      metrics={metrics} 
      initialLeads={initialLeads || []} 
    />
  );
}
