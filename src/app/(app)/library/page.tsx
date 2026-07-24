import { LibraryHeader } from "@/components/library-header";
import { LibraryTabs } from "@/components/library-tabs";
import { createClient, getCachedUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getFilterDate } from "@/lib/utils";

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
        <LibraryHeader />

        <div className="mt-6">
          <LibraryTabs opportunities={opportunities || []} />
        </div>
      </div>
    </div>
  );
}
