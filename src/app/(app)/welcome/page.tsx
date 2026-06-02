import { Zap, PlayCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
        <Zap className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
        Bem-vindo ao <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">ViralBook AI</span>
      </h1>
      
      <p className="text-xl text-muted-foreground leading-relaxed">
        Você acaba de entrar no grupo de fundadores que não dependem da sorte. Nossa inteligência artificial está pronta para encontrar o seu próximo micro-SaaS de sucesso.
      </p>

      <div className="w-full aspect-video rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
        <PlayCircle className="h-16 w-16 text-primary mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
        <p className="text-sm font-medium text-muted-foreground">Assista ao Tutorial de 2 Minutos (Em Breve)</p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button size="lg" className="h-12 px-8 font-bold shadow-lg shadow-primary/20 rounded-xl" asChild>
          <Link href="/dashboard">
            Acessar o Radar Global <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
