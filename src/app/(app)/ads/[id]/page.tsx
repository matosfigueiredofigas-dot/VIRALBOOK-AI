import { createClient, getCachedUser } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { AdsDashboard } from "@/components/ads-dashboard"

export const dynamic = 'force-dynamic';

export default async function AdsPage(props: { params: Promise<{ id: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const params = await props.params;

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('id, saas_name, target_audience, problem_solved, mvp_features, ads_ai_json')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <AdsDashboard opportunity={opportunity} />
    </div>
  )
}
