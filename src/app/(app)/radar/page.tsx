import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"

import { getFilterDate } from "@/lib/utils"
import { BookSearcher } from "@/components/book-searcher"
import { ProcessedBooks } from "@/components/processed-books"

export const dynamic = 'force-dynamic';

export default async function RadarPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('id, book_title, book_author, book_category, country, created_at')
    .or(`user_id.is.null,user_id.eq.${user.id}`)
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

