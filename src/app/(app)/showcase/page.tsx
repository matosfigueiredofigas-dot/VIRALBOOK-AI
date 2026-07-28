import { createClient, getCachedUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ShowcaseClient } from "@/components/showcase-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Showcase da Comunidade — ViralBook AI",
  description: "Descobre produtos reais construídos pela comunidade ViralBook AI. Inspira-te e publica o teu projeto.",
};

export default async function ShowcasePage() {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Busca os projetos aprovados ordenados por votos
  const { data: projects } = await supabase
    .from("showcase_projects")
    .select("id, title, tagline, description, url, screenshot_url, category, tags, upvotes_count, created_at, user_id, opportunity_id")
    .eq("status", "approved")
    .order("upvotes_count", { ascending: false })
    .limit(48);

  // Busca os emails dos autores
  const userIds = [...new Set((projects || []).map((p: any) => p.user_id))];
  let authorMap: Record<string, string> = {};
  if (userIds.length > 0) {
    // Usa profiles se existir, caso contrário usa auth.users via service (fallback)
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds);
    if (profilesData) {
      profilesData.forEach((p: any) => { authorMap[p.id] = p.email; });
    }
  }

  // Votos do utilizador atual
  const projectIds = (projects || []).map((p: any) => p.id);
  let votedIds: string[] = [];
  if (projectIds.length > 0) {
    const { data: userVotes } = await supabase
      .from("showcase_upvotes")
      .select("project_id")
      .eq("user_id", user.id)
      .in("project_id", projectIds);
    votedIds = (userVotes || []).map((v: any) => v.project_id);
  }

  const enrichedProjects = (projects || []).map((p: any) => ({
    ...p,
    author_email: authorMap[p.user_id] || user.email || "Criador",
    has_voted: votedIds.includes(p.id),
  }));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-8 -m-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <ShowcaseClient
          currentUserId={user.id}
          initialProjects={enrichedProjects}
        />
      </div>
    </div>
  );
}
