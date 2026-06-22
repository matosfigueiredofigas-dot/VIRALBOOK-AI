import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminPanelClient } from "./admin-panel-client";

import { checkAdmin } from "@/utils/supabase/admin";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = await checkAdmin(supabase);

  if (!isAdmin) {
    redirect("/dashboard");
  }

  // Busca dados iniciais de Oportunidades para exibir na moderação
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('id, saas_name, book_title, country, viral_opportunity_score, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-red-500 to-amber-500 bg-clip-text text-transparent w-fit pb-1">
          Painel de Controle Administrador
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Gerenciamento global do ecossistema ViralBook AI, usuários premium e contatos de suporte.
        </p>
      </div>

      <AdminPanelClient initialOpps={opportunities || []} />
    </div>
  );
}
