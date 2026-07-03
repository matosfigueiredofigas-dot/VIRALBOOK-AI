import { createClient, getCachedUser } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { TeardownDashboard } from "@/components/teardown-dashboard"

export const dynamic = 'force-dynamic';

export default async function TeardownPage(props: { params: Promise<{ id: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const params = await props.params;

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('id, saas_name, target_audience, problem_solved, mvp_features, competitive_advantage, market_teardown_json')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <TeardownDashboard opportunity={opportunity} />
    </div>
  )
}
