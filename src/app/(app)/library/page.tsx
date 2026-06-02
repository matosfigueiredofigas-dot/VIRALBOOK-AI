import { Sparkles } from "lucide-react"
import { IdeaGenerator } from "@/components/idea-generator"

export const dynamic = 'force-dynamic';

export default function LibraryPage() {
  return (
    <div className="theme-tech-ai w-full min-h-[calc(100vh-4rem)] p-8 -m-8 bg-background text-foreground transition-colors duration-500 rounded-2xl">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-xl shadow-primary/20 mb-2">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent pb-2">
            A Fonte Infinita
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Nosso motor de permutações cruza mercados, dores reais e tecnologias de ponta para gerar instantaneamente milhares de micro-nichos altamente rentáveis.
          </p>
        </div>

        <div className="mt-12">
          <IdeaGenerator />
        </div>
      </div>
    </div>
  )
}
