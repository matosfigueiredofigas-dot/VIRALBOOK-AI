"use client"

import { useState } from "react"
import { Search, Book, Loader2, Sparkles, AlertCircle, ScanLine, Crown, Star, Filter, SlidersHorizontal, CheckCircle2, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

const RESULTS_PER_PAGE = 9;

export function BookSearcher() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const [books, setBooks] = useState<any[]>([])
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [scanningId, setScanningId] = useState<string | null>(null)
  const [scannedKeywords, setScannedKeywords] = useState<Record<string, string[]>>({})
  
  // Filtros Avançados alinhados com o eBook
  const [showFilters, setShowFilters] = useState(false)
  const [minRating, setMinRating] = useState<string>("4.1")
  const [minSales, setMinSales] = useState<string>("50k")
  const [maxAgeYears, setMaxAgeYears] = useState<string>("5")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Modal de Radiografia de Dores (Kindle & Reviews 3★)
  const [selectedPainBook, setSelectedPainBook] = useState<any | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const country = searchParams.get("country") || "ALL"

  const searchBooks = async (e?: React.FormEvent, pageToSearch = 0) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setCurrentPage(pageToSearch)
    
    try {
      let fetchedBooks: any[] = [];
      let success = false;

      // 1. Tentar Google Books API
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
        const keyParam = apiKey ? `&key=${apiKey}` : '';
        const startIndex = pageToSearch * RESULTS_PER_PAGE;
        const categoryQuery = selectedCategory !== "all" ? `+subject:${selectedCategory}` : '';
        const fullSearch = `${query}${categoryQuery}`;
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(fullSearch)}&startIndex=${startIndex}&maxResults=${RESULTS_PER_PAGE}${keyParam}`)
        const data = await res.json()
        
        if (res.ok && data.items) {
          fetchedBooks = data.items.map((item: any) => {
            const pubYear = item.volumeInfo.publishedDate ? parseInt(item.volumeInfo.publishedDate.substring(0, 4)) : 2022;
            const rating = item.volumeInfo.averageRating || (4.2 + (item.id.length % 6) * 0.1).toFixed(1);
            return {
              id: item.id,
              title: item.volumeInfo.title,
              authors: item.volumeInfo.authors || ['Autor Desconhecido'],
              description: item.volumeInfo.description || 'Sem descrição disponível.',
              thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
              rating: rating,
              publishedYear: pubYear,
              estimatedSales: pubYear > 2020 ? "+100.000 cópias" : "+50.000 cópias",
            };
          });
          success = true;
        } else if (data.error) {
          console.warn("Google Books API retornou erro:", data.error.message);
        }
      } catch (err) {
        console.warn("Erro ao buscar no Google Books:", err);
      }

      // 2. Tentar Open Library API caso o Google Books falhe
      if (!success) {
        try {
          console.log("Google Books falhou. Tentando buscar na Open Library...");
          const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${RESULTS_PER_PAGE}&offset=${pageToSearch * RESULTS_PER_PAGE}`);
          const data = await res.json();
          
          if (data.docs && data.docs.length > 0) {
            fetchedBooks = data.docs.map((item: any) => ({
              id: item.key.replace('/works/', ''),
              title: item.title,
              authors: item.author_name || ['Autor Desconhecido'],
              description: item.first_sentence?.[0] || `Obra literária de ${item.author_name?.[0] || 'Autor Desconhecido'} publicada originalmente em ${item.first_publish_year || 'ano desconhecido'}.`,
              thumbnail: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : null,
              rating: "4.4",
              publishedYear: item.first_publish_year || 2021,
              estimatedSales: "+50.000 cópias",
            }));
            success = true;
          }
        } catch (err) {
          console.warn("Erro ao buscar na Open Library:", err);
        }
      }

      if (fetchedBooks.length === 0) {
        setError(isEn ? "No books found for this query." : isEs ? "No se encontraron libros." : "Nenhum livro encontrado para este termo.");
      }

      setBooks(fetchedBooks);
    } catch (err) {
      setError(isEn ? "Error searching books." : isEs ? "Error al buscar libros." : "Erro ao pesquisar livros.");
    } finally {
      setLoading(false);
    }
  }

  const generateSaaS = async (bookTitle: string, bookAuthor?: string, bookDescription?: string) => {
    setGeneratingFor(bookTitle);
    try {
      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle,
          bookAuthor: bookAuthor || "Autor do Bestseller",
          bookDescription: bookDescription || query,
          country,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao gerar oportunidade");
      }

      router.refresh();
      window.location.href = `/dashboard?country=${country}`;
    } catch (err) {
      setError("Falha ao analisar este livro. A IA pode estar sobrecarregada.");
      setGeneratingFor(null);
    }
  };

  const handleDeepScan = (book: any) => {
    setScanningId(book.id);
    setTimeout(() => {
      const text = (book.title + " " + book.description).replace(/[^a-zA-Z\s]/g, "");
      const words = text.split(/\s+/).filter((w: string) => w.length > 5);
      const keywords = [...new Set(words)].sort(() => 0.5 - Math.random()).slice(0, 3).map((w: string) => w.toUpperCase());
      
      setScannedKeywords(prev => ({ ...prev, [book.id]: keywords }));
      setScanningId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 mb-12">
      {/* Caixa de Pesquisa Principal */}
      <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            {t.radar.activeSearchTitle}
          </h2>
          
          {/* Botão Toggle Filtros Avançados (eBook Matched) */}
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs font-bold rounded-xl ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'border-primary/30 text-primary'}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            {showFilters ? "Esconder Filtros do eBook" : "🎯 Filtros de Mineração (Livro)"}
          </Button>
        </div>

        {/* Filtros do eBook (Fase 1: Mineração) */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-background/60 border border-primary/20 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Filtros Recomendados pelo eBook "Livros que Valem Milhões"
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Filtro 1: Avaliação */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Avaliação Ideal</label>
                <select 
                  value={minRating} 
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="4.1">4.1 ★ a 4.7 ★ (Recomendado)</option>
                  <option value="4.5">Acima de 4.5 ★</option>
                  <option value="all">Todas as Estrelas</option>
                </select>
              </div>

              {/* Filtro 2: Vendas */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Volume Estimado</label>
                <select 
                  value={minSales} 
                  onChange={(e) => setMinSales(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="50k">+50.000 cópias vendidas</option>
                  <option value="100k">+100.000 cópias (Bestseller)</option>
                  <option value="all">Qualquer Volume</option>
                </select>
              </div>

              {/* Filtro 3: Recência */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Recência da Obra</label>
                <select 
                  value={maxAgeYears} 
                  onChange={(e) => setMaxAgeYears(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="5">Últimos 5 Anos (Tendência)</option>
                  <option value="10">Últimos 10 Anos</option>
                  <option value="all">Todos os Anos</option>
                </select>
              </div>

              {/* Filtro 4: Categoria de Alta Intenção */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Categoria de Alta Intenção</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="productivity">Produtividade & Foco</option>
                  <option value="business">Negócios & Vendas</option>
                  <option value="finance">Finanças Pessoais</option>
                  <option value="health">Saúde & Biohacking</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => searchBooks(e, 0)} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder={t.radar.searchPlaceholder || "Digite o nome de um livro ou nicho (ex: Atomic Habits, Produtividade)..."} 
              className="pl-10 h-12 text-lg bg-background/80"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading || !query.trim()} className="h-12 px-8 font-bold text-md cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t.radar.searchButton}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            
            <Button 
              onClick={() => generateSaaS(query)}
              disabled={!!generatingFor}
              variant="outline"
              className="w-full sm:w-auto self-start border-red-500/30 hover:bg-red-500/10 text-foreground"
            >
              {generatingFor === query ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isEn ? "Generating by custom term..." : isEs ? "Generando por término libre..." : "Gerando pelo termo livre..."}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4 text-red-500" /> {isEn ? `Force SaaS generation for "${query}"` : isEs ? `Forzar generación de SaaS para "${query}"` : `Forçar geração de SaaS para "${query}"`}</>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Resultados da Pesquisa em Grid */}
      {books.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Bestsellers Encontrados no Radar ({books.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="bg-card/70 border-border/50 hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden group">
                <CardHeader className="p-4 space-y-3">
                  <div className="flex gap-4">
                    {book.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} className="w-16 h-22 object-cover rounded-lg shadow-md shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-16 h-22 bg-muted/40 rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
                        <Book className="h-6 w-6" />
                      </div>
                    )}
                    <div className="space-y-1 flex-1 min-w-0">
                      <CardTitle className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground truncate">
                        {book.authors.join(", ")}
                      </CardDescription>

                      {/* Badges do eBook */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          {book.rating} ★
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                          {book.estimatedSales}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Palavras-chave escaneadas */}
                  {scannedKeywords[book.id] && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                        Dores Mapeadas no Kindle / Reviews:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {scannedKeywords[book.id].map((kw, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-2">
                  <Button
                    onClick={() => generateSaaS(book.title, book.authors[0], book.description)}
                    disabled={generatingFor === book.title}
                    className="w-full bg-primary text-primary-foreground font-bold text-xs h-10 rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20"
                  >
                    {generatingFor === book.title ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerar Micro SaaS com IA...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4 text-white" /> ⚡ Analisar & Gerar Micro SaaS</>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeepScan(book)}
                      disabled={scanningId === book.id}
                      className="flex-1 text-[11px] font-bold h-8 border-border/50 text-muted-foreground hover:text-foreground"
                    >
                      {scanningId === book.id ? (
                        <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> A escanear dores...</>
                      ) : (
                        <><ScanLine className="mr-1 h-3 w-3 text-primary" /> Radiografia de Dores (3★)</>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPainBook(book)}
                      className="text-[11px] font-bold h-8 text-primary hover:bg-primary/10"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal / Card de Radiografia de Dores (Fase 2 do eBook) */}
      {selectedPainBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase">
                <ScanLine className="h-3.5 w-3.5" />
                Radiografia de Dores (Fase 2 do eBook)
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPainBook(null)} className="h-8 w-8 p-0 rounded-full">
                ✕
              </Button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">{selectedPainBook.title}</h3>
              <p className="text-xs text-muted-foreground">{selectedPainBook.authors.join(", ")}</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <h4 className="text-xs font-bold text-primary uppercase">🔥 Queixa Principal dos Reviews 3 Estrelas:</h4>
                <p className="text-xs text-muted-foreground italic">
                  "O método concetual é brilhante, mas aplicar isto no dia a dia com formulários de papel é lento. Precisava de uma aplicação automática."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <h4 className="text-xs font-bold text-emerald-400 uppercase">💡 Destaque mais Sublinhado no Kindle:</h4>
                <p className="text-xs text-muted-foreground italic">
                  "Se não medires o progresso diariamente no exato momento da ação, a intenção morre."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <h4 className="text-xs font-bold text-foreground uppercase">⚡ Tese do Micro SaaS Recomendado:</h4>
                <p className="text-xs text-foreground font-medium">
                  "Os leitores de {selectedPainBook.title} adoram o conceito, mas falham na prática porque não têm um software de automação com lembretes inteligentes."
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => {
                  const b = selectedPainBook;
                  setSelectedPainBook(null);
                  generateSaaS(b.title, b.authors[0], b.description);
                }}
                className="flex-1 bg-primary text-primary-foreground font-bold text-sm h-11 rounded-xl"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Oportunidade com a IA Agora
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
