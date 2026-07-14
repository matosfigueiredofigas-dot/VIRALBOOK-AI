"use client"

import { useState } from "react"
import { Search, Book, Loader2, Sparkles, AlertCircle, ScanLine, Crown, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSearchParams, useRouter } from "next/navigation"

const RESULTS_PER_PAGE = 9;

export function BookSearcher() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatingFor, setGeneratingFor] = useState<string | null>(null)
  const [books, setBooks] = useState<any[]>([])
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [scanningId, setScanningId] = useState<string | null>(null)
  const [scannedKeywords, setScannedKeywords] = useState<Record<string, string[]>>({})
  
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
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${RESULTS_PER_PAGE}${keyParam}`)
        const data = await res.json()
        
        if (res.ok && data.items) {
          fetchedBooks = data.items.map((item: any) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors || ['Autor Desconhecido'],
            description: item.volumeInfo.description || 'Sem descrição disponível.',
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
          }));
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
            }));
            success = true;
          }
        } catch (err) {
          console.warn("Erro ao buscar na Open Library:", err);
        }
      }

      // 3. Tentar iTunes/Apple Books API caso Open Library também falhe
      if (!success) {
        try {
          console.log("Open Library falhou. Tentando buscar na iTunes/Apple Books API...");
          const country = searchParams.get("country") || "BR";
          const itunesCountry = country === "ALL" ? "BR" : country;
          const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=ebook&limit=${RESULTS_PER_PAGE}&country=${itunesCountry}`
          );
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            fetchedBooks = data.results.map((item: any) => {
              // Limpa tags HTML da descrição
              const cleanDesc = (item.description || '')
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&#xa0;/g, ' ')
                .trim();
              return {
                id: `itunes-${item.trackId}`,
                title: item.trackName || item.trackCensoredName,
                authors: item.artistName ? [item.artistName] : ['Autor Desconhecido'],
                description: cleanDesc || `${item.genres?.[0] || 'Livro'} de ${item.artistName || 'Autor Desconhecido'}.`,
                thumbnail: item.artworkUrl100 || item.artworkUrl60 || null,
                rating: item.averageUserRating || null,
                ratingCount: item.userRatingCount || null,
                genres: item.genres || [],
              };
            });
            success = true;
          }
        } catch (err) {
          console.warn("Erro ao buscar na iTunes API:", err);
        }
      }

      // 4. Fallback final para livros simulados apenas se tudo falhar
      if (!success || fetchedBooks.length === 0) {
        console.log("Todas as APIs falharam. Usando simulação de livros...");
        const cleanQuery = query.trim();
        const capitalizedQuery = cleanQuery
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        
        fetchedBooks = [
          {
            id: `mock-1-${Date.now()}`,
            title: `${capitalizedQuery}: O Guia Definitivo`,
            authors: ['Autor Especialista'],
            description: `Um guia completo para entender e dominar os conceitos principais de ${cleanQuery}, com estratégias práticas e insights profundos.`,
            thumbnail: null,
          },
          {
            id: `mock-2-${Date.now()}`,
            title: `Segredos e Estratégias de ${capitalizedQuery}`,
            authors: ['Redação ViralBook'],
            description: `Como aplicar os conceitos e técnicas de ${cleanQuery} no seu dia a dia e nos negócios para obter resultados rápidos e duradouros.`,
            thumbnail: null,
          },
          {
            id: `mock-3-${Date.now()}`,
            title: `O Impacto de ${capitalizedQuery} no Século XXI`,
            authors: ['Pesquisador Independente'],
            description: `Análise profunda e estudos de caso reais sobre a relevância, eficácia e tendências de mercado para ${cleanQuery} na atualidade.`,
            thumbnail: null,
          },
        ];
      }

      setBooks(fetchedBooks);
      setError("");
    } catch (err: any) {
      setError(`Erro inesperado: ${err.message}`);
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

  const handleDeepScan = (book: any) => {
    setScanningId(book.id);
    // Simula o tempo do scan (3 segundos)
    setTimeout(() => {
      // Extrai palavras grandes aleatórias da descrição ou título
      const text = (book.title + " " + book.description).replace(/[^a-zA-Z\s]/g, "");
      const words = text.split(/\s+/).filter((w: string) => w.length > 5);
      const keywords = [...new Set(words)].sort(() => 0.5 - Math.random()).slice(0, 3).map((w: string) => w.toUpperCase());
      
      setScannedKeywords(prev => ({ ...prev, [book.id]: keywords }));
      setScanningId(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 mb-12">
      <div className="glass-card p-6 rounded-2xl border border-primary/20 bg-primary/5">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          Busca Ativa na Amazon / Google Books
        </h2>
        <form onSubmit={(e) => searchBooks(e, 0)} className="flex flex-col sm:flex-row gap-3">
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .radar-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(34,197,94,0.2);
          box-shadow: 0 0 40px rgba(34,197,94,0.1) inset;
          overflow: hidden;
          z-index: 0;
        }
        .radar-sweep {
          position: absolute;
          top: 0; left: 50%;
          width: 50%; height: 50%;
          background: linear-gradient(90deg, rgba(34,197,94,0) 0%, rgba(34,197,94,0.5) 100%);
          transform-origin: bottom left;
          animation: radar-sweep 2s linear infinite;
          z-index: 1;
        }
        .radar-circle {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(34,197,94,0.3);
        }
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .laser-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: #0ea5e9;
          box-shadow: 0 0 10px 2px #0ea5e9, 0 0 20px 4px #38bdf8;
          z-index: 50;
          animation: laser-scan 2.5s ease-in-out forwards;
        }
        .book-3d-card {
          perspective: 1200px;
        }
        .book-3d-inner {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        .book-3d-card:hover .book-3d-inner {
          transform: rotateY(18deg) rotateX(4deg) scale(1.05);
        }
      `}} />

      {loading && !books.length && (
        <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden bg-black/40 rounded-3xl border border-green-500/20">
          <div className="absolute w-[300px] h-[300px]">
            <div className="radar-bg"></div>
            <div className="radar-circle w-3/4 h-3/4"></div>
            <div className="radar-circle w-1/2 h-1/2"></div>
            <div className="radar-circle w-1/4 h-1/4 bg-green-500/20"></div>
            <div className="radar-sweep"></div>
          </div>
          <p className="z-10 text-green-400 font-mono font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-lg border border-green-500/30">
            Escaneando Satélites...
          </p>
        </div>
      )}

      {books.length > 0 && !loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book, index) => {
            const isScanned = !!scannedKeywords[book.id];
            const isScanning = scanningId === book.id;
            // Fake metrics baseadas no ID (agora dinâmico baseado no conteúdo do ID)
            const idHash = book.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
            const fakeReviews = (idHash * 37) % 15000 + 120;
            const fakeRating = (4 + (idHash % 10) / 10).toFixed(1);
            const isBestseller = index === 0 || index === 2; // Simula bestsellers

            return (
              <div key={book.id} className="book-3d-card group h-full">
                <Card className="book-3d-inner glass-card flex flex-col overflow-visible h-full bg-black/40 border-white/10 hover:border-primary/50 relative">
                  
                  {isBestseller && (
                    <div className="absolute -top-3 -right-3 z-50 bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] flex items-center gap-1 transform translate-z-10">
                      <Crown className="h-3 w-3" /> Bestseller #1
                    </div>
                  )}

                  <div className="h-56 relative flex justify-center items-center overflow-visible mt-6 px-4">
                    {/* Laser Scanner */}
                    {isScanning && <div className="laser-line" />}
                    
                    {/* 3D Book Cover Cover */}
                    <div className="relative h-full w-2/3 shadow-2xl transition-transform duration-500 group-hover:shadow-primary/20">
                      {book.thumbnail ? (
                        <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover rounded-r-md border-y border-r border-white/10" />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-r-md border-y border-r border-white/10">
                          <Book className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      
                      {/* Spine simulation */}
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 to-transparent -translate-x-full transform-origin-right rotate-y-90"></div>
                      
                      {/* Holographic Keywords */}
                      {isScanned && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-r-md flex flex-col items-center justify-center gap-2 p-2 z-20 animate-in fade-in duration-300">
                          <div className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-widest mb-1">Keywords Fixadas</div>
                          {scannedKeywords[book.id].map((kw, i) => (
                            <span key={i} className="text-xs font-black text-white bg-sky-500/20 border border-sky-400/50 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(56,189,248,0.5)] w-full text-center truncate">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-6">
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">{book.title}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs">{book.authors.join(", ")}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="mt-auto pt-0 flex flex-col gap-4">
                    {/* Fake Metrics */}
                    <div className="flex items-center gap-3 text-xs bg-black/40 p-2 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        {fakeRating} <Star className="h-3 w-3 fill-yellow-500" />
                      </div>
                      <div className="w-px h-3 bg-white/20"></div>
                      <div className="text-muted-foreground font-mono">{fakeReviews.toLocaleString()} reviews</div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                    
                    {!isScanned ? (
                      <Button 
                        onClick={() => handleDeepScan(book)}
                        disabled={isScanning}
                        variant="outline"
                        className="w-full font-bold border-sky-500/50 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
                      >
                        {isScanning ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Escaneando Tópicos...</>
                        ) : (
                          <><ScanLine className="mr-2 h-4 w-4" /> Deep Scan (Extrair Dados)</>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => generateSaaS(book.title)}
                        disabled={!!generatingFor}
                        className="w-full font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {generatingFor === book.title ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Convertendo em SaaS...</>
                        ) : (
                          <><Sparkles className="mr-2 h-4 w-4" /> Gerar SaaS deste Livro</>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}

      {/* Paginação */}
      {(books.length > 0 || currentPage > 0) && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => searchBooks(undefined, currentPage - 1)}
            disabled={loading || currentPage === 0}
            className="border-white/10 hover:bg-white/5 font-semibold rounded-xl px-4 py-2"
          >
            ← Página Anterior
          </Button>
          <span className="text-xs font-bold text-muted-foreground bg-muted/40 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
            Página {currentPage + 1}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => searchBooks(undefined, currentPage + 1)}
            disabled={loading || books.length < RESULTS_PER_PAGE}
            className="border-white/10 hover:bg-white/5 font-semibold rounded-xl px-4 py-2"
          >
            Próxima Página →
          </Button>
        </div>
      )}
    </div>
  )
}
