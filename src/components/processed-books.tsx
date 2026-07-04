"use client"

import { useState } from "react"
import { LayoutGrid, Table as TableIcon, Calendar, User, Tag, BookOpen, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface ProcessedBook {
  id: string
  book_title: string
  book_author: string
  book_category: string
  country: string
  created_at: string
}

interface ProcessedBooksProps {
  initialBooks: ProcessedBook[]
}

// Premium color gradient mappings based on categories
function getCategoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("tech") || cat.includes("comput") || cat.includes("program") || cat.includes("tecnolog")) {
    return "from-violet-600 to-indigo-900 shadow-violet-500/10";
  }
  if (cat.includes("financ") || cat.includes("negoc") || cat.includes("busi") || cat.includes("admin") || cat.includes("empreend")) {
    return "from-emerald-600 to-teal-900 shadow-emerald-500/10";
  }
  if (cat.includes("saud") || cat.includes("health") || cat.includes("diet") || cat.includes("psico") || cat.includes("aliment") || cat.includes("bem-estar")) {
    return "from-rose-500 to-red-900 shadow-rose-500/10";
  }
  if (cat.includes("produtiv") || cat.includes("foco") || cat.includes("self") || cat.includes("desenv") || cat.includes("hábit") || cat.includes("evoluc")) {
    return "from-amber-500 to-orange-800 shadow-amber-500/10";
  }
  if (cat.includes("turis") || cat.includes("viag") || cat.includes("travel")) {
    return "from-sky-500 to-blue-800 shadow-sky-500/10";
  }
  if (cat.includes("educa") || cat.includes("crian") || cat.includes("kids")) {
    return "from-pink-500 to-purple-800 shadow-pink-500/10";
  }
  return "from-blue-600 to-slate-900 shadow-blue-500/10";
}

export function ProcessedBooks({ initialBooks }: ProcessedBooksProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"mosaic" | "table">("mosaic")

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente a análise do livro "${title}"?`)) {
      const res = await fetch('/api/radar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert('Livro excluído com sucesso!');
        router.refresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Erro ao excluir livro.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Últimos Livros Processados pelo Sistema
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total de {initialBooks.length} livro(s) analisado(s) recentemente
          </p>
        </div>

        {/* View Mode Toggle Switch */}
        <div className="flex items-center self-end sm:self-auto p-1 rounded-xl bg-muted/40 border border-border/40 backdrop-blur-md">
          <Button
            variant={viewMode === "mosaic" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("mosaic")}
            className={`gap-1.5 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "mosaic" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                : "text-muted-foreground hover:text-primary hover:bg-muted/40"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Mosaico
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={`gap-1.5 px-3 py-1.5 h-8 rounded-lg text-xs font-semibold transition-all duration-300 ${
              viewMode === "table" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                : "text-muted-foreground hover:text-primary hover:bg-muted/40"
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            Tabela
          </Button>
        </div>
      </div>

      {/* Render based on selected view mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .book-mosaic-card {
          perspective: 1200px;
        }
        .book-mosaic-inner {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        .book-mosaic-card:hover .book-mosaic-inner {
          transform: rotateY(15deg) rotateX(2deg) scale(1.02);
        }
        .book-glare {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.3) 25%, transparent 35%);
          transform: translateX(-150%);
          transition: transform 0.7s ease-in-out;
          pointer-events: none;
          z-index: 50;
        }
        .book-mosaic-card:hover .book-glare {
          transform: translateX(150%);
        }
      `}} />

      {viewMode === "mosaic" ? (
        /* MOSAIC VIEW (Library Bookshelf Aesthetic) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {initialBooks.map((book, idx) => {
            const capGradient = getCategoryColor(book.book_category);
            return (
              <div 
                key={idx} 
                className="group relative flex flex-col justify-between overflow-visible bg-card/30 border border-border/40 backdrop-blur-md transition-all duration-300 rounded-2xl p-4 book-mosaic-card h-[320px]"
              >
                {/* 3D simulated book cover preview */}
                <div className={`book-mosaic-inner relative h-48 rounded-r-xl bg-gradient-to-br ${capGradient} flex flex-col justify-between p-4 text-white shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/20`}>
                  {/* Book Glare Effect */}
                  <div className="book-glare"></div>

                  {/* Book spine overlay */}
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/80 to-transparent -translate-x-full transform-origin-right rotate-y-90"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/30 shadow-[1px_0_2px_rgba(255,255,255,0.2)]"></div>

                  {/* Header info */}
                  <div className="flex justify-between items-center pl-2 w-full z-20">
                    <Badge className="bg-white/20 border-none backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-wider py-0.5 px-2">
                      {book.book_category || "Geral"}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(book.id, book.book_title);
                      }}
                      className="p-1 rounded-md bg-black/30 hover:bg-red-600/80 text-white/80 hover:text-white transition-all cursor-pointer z-30"
                      title="Excluir do Radar"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {/* Book Title and Author */}
                  <div className="space-y-1.5 pl-2">
                    <a 
                      href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.book_title + " " + (book.book_author || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline block z-20 relative text-white"
                    >
                      <h3 className="font-extrabold text-sm line-clamp-2 leading-tight drop-shadow-md font-serif">
                        {book.book_title}
                      </h3>
                    </a>
                    <p className="text-[10px] text-white/80 font-medium italic truncate">
                      por {book.book_author || "Autor Mapeado"}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="flex justify-between items-center pl-2 pt-1.5 text-[9px] text-white/70 font-semibold border-t border-white/15">
                    <span>MERCADO: {book.country}</span>
                    <span>{new Date(book.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Additional Info below the cover */}
                <div className="mt-3.5 space-y-1 pl-1">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Livro Mapeado</div>
                  <a 
                    href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.book_title + " " + (book.book_author || ""))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {book.book_title}
                    </h4>
                  </a>
                  <p className="text-xs text-muted-foreground truncate">
                    {book.book_author || "Autor Desconhecido"}
                  </p>
                </div>
              </div>
            );
          })}

          {!initialBooks.length && (
            <div className="col-span-full py-16 text-center text-muted-foreground bg-muted/10 border border-dashed border-border/50 rounded-3xl">
              Nenhum e-book capturado neste país.
            </div>
          )}
        </div>
      ) : (
        /* TABLE VIEW (Standard layout) */
        <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-md overflow-hidden animate-in fade-in duration-500">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Capturado Em</TableHead>
                <TableHead className="w-[80px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialBooks.map((book, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">
                    <a 
                      href={`https://www.google.com/search?tbm=bks&q=${encodeURIComponent(book.book_title + " " + (book.book_author || ""))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {book.book_title}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{book.book_author}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs">{book.book_category}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                      onClick={() => handleDelete(book.id, book.book_title)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {!initialBooks.length && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhum e-book capturado neste país.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
