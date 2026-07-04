import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Mail } from "lucide-react"
import { EmailFunnelClient } from "@/components/email-funnel-client"

export const dynamic = 'force-dynamic';

export default async function EmailFunnelPage(props: { searchParams: Promise<{ oppId?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const oppId = searchParams.oppId;

  // Buscar as oportunidades criadas pelo próprio usuário
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('id, saas_name, target_audience, problem_solved, book_title, email_funnel')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-8 w-8 text-primary" />
          Automação de E-mails
        </h1>
        <p className="text-muted-foreground mt-2">
          Gere e configure sequências completas de e-mails de lançamento para manter seus leads aquecidos e convertê-los em clientes.
        </p>
      </div>

      <EmailFunnelClient initialOpportunities={opportunities || []} initialSelectedId={oppId} />
    </div>
  )
}
