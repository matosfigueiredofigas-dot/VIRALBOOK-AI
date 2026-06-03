import { Zap, PlayCircle, ArrowRight, BookOpen, Sparkles, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 py-10">
      
      {/* Header Section */}
      <div className="text-center space-y-6 max-w-3xl">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-xl shadow-primary/20 mb-6">
          <Zap className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Sua Fábrica de <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">Micro-SaaS Validados</span>
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed">
          O ViralBook AI usa inteligência artificial para vasculhar os livros mais vendidos, checar tendências e desenhar o seu próximo negócio lucrativo do zero.
        </p>
      </div>

      {/* 3 Steps Section */}
      <div className="grid md:grid-cols-3 gap-6 w-full pt-8">
        <Card className="glass-card hover:-translate-y-2 transition-transform duration-300">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
              <BookOpen className="h-7 w-7 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold">1. Encontre a Dor</h3>
            <p className="text-muted-foreground">
              Vá ao Radar de E-books e procure por tópicos em alta. Se existem livros best-sellers sobre um problema, existe gente pagando por soluções.
            </p>
            <Link href="/radar" className="text-indigo-500 mt-auto text-sm font-semibold underline-offset-4 hover:underline">
              Explorar Radar &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold">2. Combine Ideias</h3>
            <p className="text-muted-foreground">
              Acesse a Biblioteca de Ideias, gire a roleta e misture públicos, problemas e tecnologias em mercados de Oceano Azul.
            </p>
            <Link href="/library" className="text-primary mt-auto text-sm font-semibold underline-offset-4 hover:underline">
              Gerar Combinações &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-2 transition-transform duration-300">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <LayoutDashboard className="h-7 w-7 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">3. Execute o Plano</h3>
            <p className="text-muted-foreground">
              No Dashboard, veja o Score Viral da sua ideia, extraia o Lean Canvas completo e copie os Prompts para a IA programar para você.
            </p>
            <Link href="/dashboard" className="text-green-500 mt-auto text-sm font-semibold underline-offset-4 hover:underline">
              Ver Oportunidades &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 pt-12 items-center justify-center">
        <Link 
          href="/library" 
          className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 rounded-xl hover:scale-105 transition-transform"
        >
          <Sparkles className="mr-2 h-5 w-5" /> Começar a Gerar Agora
        </Link>
        <Link 
          href="/radar" 
          className="group/button inline-flex shrink-0 items-center justify-center border border-border bg-background hover:bg-muted hover:text-foreground h-14 px-8 text-lg rounded-xl glass-card hover:bg-white/5"
        >
          <BookOpen className="mr-2 h-5 w-5" /> Vasculhar a Amazon
        </Link>
      </div>
    </div>
  )
}
