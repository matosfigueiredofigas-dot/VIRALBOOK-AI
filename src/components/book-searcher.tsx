"use client"

import { useState } from "react"
import { Search, Book, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSearchParams, useRouter } from "next/navigation"

export function BookSearcher() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const [books, setBooks] = useState<any[]>([])
  const [error, setError] = useState("")
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const country = searchParams.get("country") || "US"

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError("")
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=9${keyParam}`)
      const data = await res.json()
      
      if (res.ok && data.items) {
        setBooks(data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors || ['Autor Desconhecido'],
          description: item.volumeInfo.description || 'Sem descrição disponível.',
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
        })))
      } else if (data.error) {
        setBooks([])
        const isQuota = data.error.message?.toLowerCase().includes("quota exceeded")
        if (isQuota) {
          setError("Limite diário de buscas gratuitas do Google atingido. Use o botão abaixo para gerar sem as capas.")
        } else {
          setError(`Erro da API: ${data.error.message}`)
        }
      } else {
        setBooks([])
        setError("Nenhum livro encontrado para este termo.")
      }
    } catch (err: any) {
      setError(`Erro ao buscar: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const generateSaaS = async (bookTitle: string) => {
    setGeneratingFor(bookTitle)
    setError("")
    
    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: bookTitle, country })
      })

      if (!res.ok) {
        throw new Error("Erro ao gerar oportunidade")
      }

      // Limpar cache e ir pro dashboard
      router.refresh()
      window.location.href = `/dashboard?country=${country}`
    } catch (err) {
      setError("Falha ao analisar este livro. A IA pode estar sobrecarregada.")
      setGeneratingFor(null)
    }
  }

  return (
    <div className="space-y-6 mb-12">
      <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-primary/5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          Busca Ativa na Amazon / Google Books
        </h2>
        <form onSubmit={searchBooks} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Digite um problema, nicho ou nome de um livro..." 
              className="pl-10 h-12 text-lg bg-background/80"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()} className="h-12 px-8 font-bold text-md">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Procurar Livros"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            
            {/* Fallback button when no books are found */}
            <Button 
              onClick={() => generateSaaS(query)}
              disabled={!!generatingFor}
              variant="outline"
              className="w-full sm:w-auto self-start border-red-500/30 hover:bg-red-500/10 text-foreground"
            >
              {generatingFor === query ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando pelo termo livre...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4 text-red-500" /> Forçar geração de SaaS para "{query}"</>
              )}
            </Button>
          </div>
        )}
      </div>

      {books.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="glass-card flex flex-col overflow-hidden">
              <div className="h-40 bg-muted/30 relative flex justify-center items-center overflow-hidden border-b border-border/50">
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} className="h-full object-cover blur-sm absolute inset-0 w-full opacity-30" />
                ) : null}
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} className="h-36 shadow-lg z-10" />
                ) : (
                  <Book className="h-12 w-12 text-muted-foreground/50" />
                )}
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1">{book.authors.join(", ")}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0 flex flex-col gap-4">
                <p className="text-xs text-muted-foreground line-clamp-3">{book.description}</p>
                <Button 
                  onClick={() => generateSaaS(book.title)}
                  disabled={!!generatingFor}
                  className="w-full font-bold shadow-md shadow-primary/20"
                >
                  {generatingFor === book.title ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando com IA...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Gerar SaaS deste Livro</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
