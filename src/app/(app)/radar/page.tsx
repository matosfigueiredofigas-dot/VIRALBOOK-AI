import { supabase } from "@/lib/supabase"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen } from "lucide-react"

import { getFilterDate } from "@/lib/utils"
import { BookSearcher } from "@/components/book-searcher"

export const dynamic = 'force-dynamic';

export default async function RadarPage(props: { searchParams: Promise<{ country?: string, time?: string }> }) {
  const searchParams = await props.searchParams;
  const country = searchParams.country || "US";
  const time = searchParams.time || "all";
  const filterDate = getFilterDate(time);

  let query = supabase
    .from('opportunities')
    .select('book_title, book_author, book_category, country, created_at')
    .eq('country', country)
    .order('created_at', { ascending: false });

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
          Base literária de {country} escaneada.
        </p>
      </div>

      <BookSearcher />

      <div className="mt-12 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Últimos Livros Processados pelo Sistema
        </h2>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Capturado Em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books?.map((book, i) => (
              <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-primary">{book.book_title}</TableCell>
                <TableCell className="text-muted-foreground">{book.book_author}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-secondary text-xs">{book.book_category}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            
            {!books?.length && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum ebook capturado neste país.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
