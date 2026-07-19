import { Sparkles } from "lucide-react"
import { LibraryTabs } from "@/components/library-tabs"
import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function LibraryPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  // Busca as oportunidades mapeadas anteriormente no banco (globais ou do próprio usuário)
  let query = supabase
    .from('opportunities')
    .select('id, created_at, book_title, book_author, book_category, viral_opportunity_score, country, saas_name, problem_solved')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (country !== "ALL") {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: opportunities } = await query;

  return (
    <div className="theme-tech-ai w-full min-h-[calc(100vh-4rem)] p-8 -m-8 bg-background text-foreground transition-colors duration-500 rounded-2xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-xl shadow-primary/20 mb-2">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent pb-2">
            Biblioteca & Fonte Infinita
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Gere novos conceitos de software a partir de cruzamentos de nichos ou acesse a biblioteca de e-books e análises de mercado já realizadas.
          </p>
        </div>

        <div className="mt-6">
          <LibraryTabs opportunities={opportunities || []} />
        </div>
      </div>
    </div>
  )
}
