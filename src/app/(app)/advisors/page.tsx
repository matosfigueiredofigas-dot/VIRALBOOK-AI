import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Users } from "lucide-react"
import { AdvisorsClient } from "@/components/advisors-client"
import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function AdvisorsPage(props: { searchParams: Promise<{ time?: string, oppId?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const time = searchParams.time || "now";
  const oppId = searchParams.oppId;
  const filterDate = getFilterDate(time);

  // Buscar as oportunidades criadas pelo próprio usuário
  let query = supabase
    .from('opportunities')
    .select('id, saas_name, target_audience, problem_solved, book_title, advisor_advice')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: opportunities } = await query;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Conselho de Mentores (IA)
        </h1>
        <p className="text-muted-foreground mt-2">
          Reúna opiniões estratégicas, críticas honestas e conselhos práticos de lendas como Paul Graham, Steve Jobs, Pieter Levels, Naval Ravikant, Elon Musk, Sam Altman, Mark Zuckerberg e Jeff Bezos.
        </p>
      </div>

      <AdvisorsClient initialOpportunities={opportunities || []} initialSelectedId={oppId} />
    </div>
  )
}
