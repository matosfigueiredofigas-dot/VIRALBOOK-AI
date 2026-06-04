"use client"

import { useState } from "react"
import { LayoutGrid, Table as TableIcon, Calendar, User, Tag, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProcessedBook {
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
  const [viewMode, setViewMode] = useState<"mosaic" | "table">("mosaic")

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
      {viewMode === "mosaic" ? (
        /* MOSAIC VIEW (Library Bookshelf Aesthetic) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {initialBooks.map((book, idx) => {
            const capGradient = getCategoryColor(book.book_category);
            return (
              <div 
                key={idx} 
                className="group relative flex flex-col justify-between overflow-hidden bg-card/30 border border-border/40 backdrop-blur-md hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl p-4"
              >
                {/* 3D simulated book cover preview */}
                <div className={`relative h-48 rounded-xl bg-gradient-to-br ${capGradient} flex flex-col justify-between p-4 text-white shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}>
                  {/* Book spine overlay */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />

                  {/* Header info */}
                  <div className="flex justify-between items-start pl-2">
                    <Badge className="bg-white/20 border-none backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-wider py-0.5 px-2">
                      {book.book_category || "Geral"}
                    </Badge>
                  </div>
                  
                  {/* Book Title and Author */}
                  <div className="space-y-1.5 pl-2">
                    <h3 className="font-extrabold text-sm line-clamp-2 leading-tight drop-shadow-md font-serif text-white">
                      {book.book_title}
                    </h3>
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
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {book.book_title}
                  </h4>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialBooks.map((book, i) => (
                <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">{book.book_title}</TableCell>
                  <TableCell className="text-muted-foreground">{book.book_author}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-md bg-secondary text-xs">{book.book_category}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</TableCell>
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
