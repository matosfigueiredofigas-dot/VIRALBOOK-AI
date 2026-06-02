"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, Filter, LayoutGrid, List, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransition, useState, useEffect } from "react"

export function AdvancedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [minScore, setMinScore] = useState(searchParams.get("minScore") || "0")
  const view = searchParams.get("view") || "grid"

  // Debounce search input to avoid hitting the server on every keystroke
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (search) params.set("search", search)
      else params.delete("search")

      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, router, searchParams])

  const handleScoreChange = (value: string) => {
    setMinScore(value)
    const params = new URLSearchParams(searchParams.toString())
    
    if (value !== "0") params.set("minScore", value)
    else params.delete("minScore")

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const toggleView = (mode: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === "list") params.set("view", "list")
    else params.delete("view")

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 border border-border/50 rounded-xl mb-6 items-center">
      <div className="flex items-center gap-2 w-full sm:w-auto flex-1 relative">
        <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input 
          placeholder="Buscar por nicho, nome ou problema..." 
          className="pl-9 pr-9 bg-background/50 border-border/50 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isPending && (
          <Loader2 className="h-4 w-4 absolute right-3 text-primary animate-spin" />
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={minScore} onValueChange={handleScoreChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/50">
            <SelectValue placeholder="Score Mínimo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Todos os Scores</SelectItem>
            <SelectItem value="50">🔥 Acima de 50</SelectItem>
            <SelectItem value="70">🚀 Acima de 70</SelectItem>
            <SelectItem value="85">⭐ Acima de 85</SelectItem>
            <SelectItem value="95">🦄 Acima de 95 (Raro)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1 bg-background/50 p-1 rounded-lg border border-border/50">
        <button 
          onClick={() => toggleView("grid")}
          className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button 
          onClick={() => toggleView("list")}
          className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
