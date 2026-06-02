import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AdminPanelClient } from "./admin-panel-client";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verifica se o usuário é o dono principal pelo email
  // ou se ele possui a role de admin na tabela profiles
  let isAdmin = false;
  if (user.email === 'moisesdematos@gmail.com') {
    isAdmin = true;
  } else {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

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
