"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [isUSD, setIsUSD] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Simples */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ViralBook AI</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center px-4 py-2 rounded-full hover:bg-white/5">
            Login Interno
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 max-w-4xl relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 animate-pulse">
              ✨ O Primeiro Radar Anti-Achismos do Brasil
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm leading-[1.1]">
              Descubra o próximo <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">
                SaaS Bilionário
              </span> antes de todo mundo.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
              A inteligência artificial que varre a internet para encontrar os micro-nichos mais lucrativos, inexplorados e com maior potencial de viralização. Pare de adivinhar. Comece a construir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)]" asChild>
                <Link href="#pricing">
                  Garantir Meu Acesso Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-black/40 border-y border-white/5 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Tudo que você precisa para dominar o mercado</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Nós construímos as ferramentas exatas que os grandes fundadores usam para encontrar oceanos azuis.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 glass-card transition-all hover:bg-white/[0.08] hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                  <Target className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Radar de Sinais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Algoritmo que analisa conversas no Reddit, produtos da Amazon e tendências em tempo real para encontrar as maiores dores não resolvidas.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 glass-card transition-all hover:bg-white/[0.08] hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
                  <BookOpen className="h-7 w-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Biblioteca Infinita</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gerador de ideias que cruza mais de 10 milhões de combinações entre públicos, tecnologias e monetizações para revelar oceanos azuis imediatos.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 glass-card transition-all hover:bg-white/[0.08] hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                  <Lock className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Cofre de Nichos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tenha sua própria gaveta de oportunidades salvas. Monitore o custo de desenvolvimento, o nível de saturação e o potencial de receita de cada ideia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section (Lemon Squeezy) */}
        <section id="pricing" className="w-full py-24 md:py-32 px-4 md:px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">Acesso Vitalício. <br className="md:hidden"/>Pagamento Único.</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sem mensalidades escondidas. Assuma a vanguarda da criação de produtos de IA hoje mesmo.
            </p>

            {/* Toggle USD / BRL */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className={`text-sm font-medium ${!isUSD ? 'text-white' : 'text-muted-foreground'}`}>BRL (R$)</span>
              <button 
                onClick={() => setIsUSD(!isUSD)}
                className="w-14 h-7 bg-white/10 rounded-full relative flex items-center p-1 transition-colors hover:bg-white/20"
              >
                <div className={`w-5 h-5 bg-primary rounded-full shadow-md transition-transform duration-300 ${isUSD ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-medium ${isUSD ? 'text-white' : 'text-muted-foreground'}`}>USD ($)</span>
            </div>

            <div className="p-[2px] rounded-[32px] bg-gradient-to-b from-primary/50 via-primary/20 to-transparent relative group max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-[32px] -z-10 group-hover:bg-primary/30 transition-all duration-700"/>
              <div className="bg-background/90 backdrop-blur-xl rounded-[30px] p-8 md:p-12 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="text-left space-y-6 flex-1">
                    <h3 className="text-3xl font-bold flex items-center gap-3 text-white">
                      Plano Fundador 
                      <span className="text-xs font-bold px-3 py-1.5 bg-primary/20 text-primary rounded-full uppercase tracking-wider">
                        POPULAR
                      </span>
                    </h3>
                    <ul className="space-y-4">
                      {['Acesso ilimitado ao Radar de Tendências', 'Gerador de Oportunidades Infinito', 'Filtros Globais e Inteligência Groq', 'Exportação de relatórios em CSV', 'Acesso às futuras atualizações'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground font-medium">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-center md:items-end w-full md:w-auto p-8 bg-white/[0.03] rounded-3xl border border-white/10 shrink-0">
                    <div className="text-muted-foreground line-through text-xl font-medium mb-1">
                      {isUSD ? "$ 129" : "R$ 497"}
                    </div>
                    <div className="text-6xl font-extrabold text-white mb-3">
                      {isUSD ? "$ 39" : "R$ 197"}
                    </div>
                    <p className="text-sm text-primary font-medium mb-8">Pagamento único. Acesso para sempre.</p>
                    
                    <Button size="lg" className="w-full md:w-auto h-14 px-8 text-lg font-bold shadow-xl rounded-xl transition-transform hover:-translate-y-1" asChild>
                      {/* O LINK DO LEMON SQUEEZY DEPENDE DA MOEDA ESCOLHIDA */}
                      <a href={isUSD ? "https://app.lemonsqueezy.com/checkout/buy/LINK_USD_AQUI" : "https://app.lemonsqueezy.com/checkout/buy/LINK_BRL_AQUI"}>
                        Comprar Acesso Agora
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
              <Lock className="h-4 w-4" />
              <span>Pagamento 100% seguro processado por Lemon Squeezy</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/20 py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Zap className="h-5 w-5" />
          <span className="font-bold text-lg tracking-tight">ViralBook AI</span>
        </div>
        <p className="text-sm">© 2026 ViralBook AI. Construindo o futuro dos micro-SaaS.</p>
      </footer>
    </div>
  );
}
