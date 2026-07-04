import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"

import { getFilterDate } from "@/lib/utils"
import { BookSearcher } from "@/components/book-searcher"
import { ProcessedBooks } from "@/components/processed-books"

export const dynamic = 'force-dynamic';

export default async function RadarPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "7d";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('id, book_title, book_author, book_category, country, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (country !== "ALL") {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data: books } = await query;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-indigo-500" />
          Ebooks Radar
        </h1>
        <p className="text-muted-foreground mt-2">
          Base literária de {country === 'ALL' ? 'TODOS PAÍSES' : country} escaneada.
        </p>
      </div>

      <BookSearcher />

      <div className="mt-12">
        <ProcessedBooks initialBooks={books || []} />
      </div>
    </div>
  )
}

