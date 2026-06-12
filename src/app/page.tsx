"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { AuthModal } from "@/components/auth-modal";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProductSimulator } from "@/components/product-simulator";

const LEMON_SQUEEZY_CHECKOUT_URLS = {
  USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-usd-id",
  BRL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-brl-id",
  EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-eur-id"
};

export default function LandingPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<'USD' | 'BRL' | 'EUR'>('USD');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "forgot">("login");

  const openAuth = (tab: "login" | "signup" | "forgot" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const getPrice = (plan: 'annual' | 'lifetime', type: 'original' | 'discount') => {
    if (plan === 'annual') {
      if (type === 'original') {
        if (currency === 'USD') return '$ 49/ano';
        if (currency === 'EUR') return '49 €/ano';
        return 'R$ 197/ano';
      } else {
        if (currency === 'USD') return '$ 19';
        if (currency === 'EUR') return '19 €';
        return 'R$ 97';
      }
    } else {
      if (type === 'original') {
        if (currency === 'USD') return '$ 129 único';
        if (currency === 'EUR') return '129 € único';
        return 'R$ 497 único';
      } else {
        if (currency === 'USD') return '$ 39';
        if (currency === 'EUR') return '39 €';
        return 'R$ 197';
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Simples */}
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">ViralBook AI</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Funcionalidades
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Preços
          </Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Documentação
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <button
            onClick={() => openAuth("login")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center px-4 py-2 rounded-full hover:bg-muted border border-border/50 cursor-pointer"
          >
            Acesso Restrito
          </button>
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/15 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 max-w-4xl relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 animate-pulse">
              ✨ O Primeiro Radar Anti-Achismos do Brasil
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm leading-[1.1]">
              Descubra o próximo <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">
                SaaS Bilionário
              </span> antes de todo mundo.
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-6">
              A inteligência artificial que varre a internet para encontrar os micro-nichos mais lucrativos, inexplorados e com maior potencial de viralização. Pare de adivinhar. Comece a construir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button 
                onClick={() => openAuth("signup")}
                className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] cursor-pointer"
              >
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link 
                href="#pricing" 
                className="group/button inline-flex shrink-0 items-center justify-center bg-muted text-foreground hover:bg-muted/80 h-14 px-8 text-lg font-bold rounded-full border border-border/50 transition-all hover:scale-105"
              >
                Ver Preços
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 pt-8 border-t border-border/40 flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">Tecnologia de ponta alimentada por</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6"/> Groq AI</div>
                <div className="flex items-center gap-2 font-bold text-xl"><BookOpen className="h-6 w-6"/> Google Books</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Lock className="h-6 w-6"/> Supabase</div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Simulator Section */}
        <section className="w-full py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Veja a IA Varrendo o Mercado em Tempo Real
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simule a análise de virabilidade de um crossover agora mesmo. Descubra a dor, o nível de saturação e o canvas da ideia selecionada.
            </p>
          </div>
          <ProductSimulator />
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-muted/20 border-y border-border/50 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Tudo que você precisa para dominar o mercado</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Nós construímos as ferramentas exatas que os grandes fundadores usam para encontrar oceanos azuis.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/20 dark:border-blue-500/30">
                  <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Radar de Sinais</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Algoritmo que analisa conversas no Reddit, produtos da Amazon e tendências em tempo real para encontrar as maiores dores não resolvidas.
                </p>
              </div>

              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20 dark:border-purple-500/30">
                  <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Biblioteca Infinita</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gerador de ideias que cruza mais de 10 milhões de combinações entre públicos, tecnologias e monetizações para revelar oceanos azuis imediatos.
                </p>
              </div>

              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20 dark:border-emerald-500/30">
                  <Lock className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Cofre de Nichos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tenha sua própria gaveta de oportunidades salvas. Monitore o custo de desenvolvimento, o nível de saturação e o potencial de receita de cada ideia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">O que dizem os Fundadores</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Quem parou de adivinhar nichos já está construindo negócios de verdade.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Lucas M.", role: "Indie Hacker", text: "Eu perdia semanas tentando validar ideias. O ViralBook encontrou uma dor latente em livros de 'Foco' e eu construí um micro-SaaS em 4 dias. Já tenho meus primeiros 10 clientes pagantes!" },
                { name: "Sofia T.", role: "Desenvolvedora Web", text: "A integração com o Groq é absurdamente rápida. O Lean Canvas que ele gera é tão detalhado que a Vantagem Injusta sugerida virou o slogan da minha nova startup." },
                { name: "Rafael C.", role: "Empreendedor", text: "O melhor investimento do ano. Usar a base do Google Books para achar dores pelas quais as pessoas já pagam para resolver mudou completamente a minha visão de negócios." }
              ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-3xl bg-card/30 border border-border/50 hover:bg-card/50 transition-colors relative shadow-sm">
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="w-full py-24 md:py-32 px-4 md:px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
              Escolha seu plano de acesso. <br className="hidden md:block"/>
              Gere seus SaaS com dados.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Selecione o plano ideal para você validar seus projetos. Aproveite nossa oferta especial de lançamento.
            </p>

            {/* Toggle USD / BRL / EUR */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 bg-muted/50 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
                {[
                  { code: 'USD', label: 'USD ($)' },
                  { code: 'BRL', label: 'BRL (R$)' },
                  { code: 'EUR', label: 'EUR (€)' }
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code as 'USD' | 'BRL' | 'EUR')}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      currency === c.code
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-left">
              {/* Card: Plano Fundador Vitalício */}
              <div className="p-[2px] rounded-[32px] bg-gradient-to-b from-primary via-primary/50 to-transparent relative group flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-[32px] -z-10 group-hover:bg-primary/25 transition-all duration-700"/>
                <div className="bg-card/90 backdrop-blur-xl rounded-[30px] p-8 md:p-12 flex flex-col justify-between h-full border border-border/50">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold text-foreground flex items-center gap-2">
                          Membro Vitalício
                        </h3>
                        <p className="text-sm text-primary mt-1.5 font-semibold">Oferta especial e definitiva de lançamento</p>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 bg-primary/20 text-primary rounded-full uppercase tracking-wider">OFERTA LIMITADA</span>
                    </div>
                    
                    <div className="py-4 border-y border-border/40 my-6">
                      <span className="text-muted-foreground line-through text-lg font-medium block">
                        {getPrice('lifetime', 'original')}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-6xl font-extrabold text-foreground tracking-tight">
                          {getPrice('lifetime', 'discount')}
                        </span>
                        <span className="text-muted-foreground text-sm font-medium">pagamento único</span>
                      </div>
                    </div>

                    <ul className="grid sm:grid-cols-2 gap-4">
                      {[
                        'Acesso vitalício ilimitado (Sem mensalidades)',
                        'Gerador de Oportunidades & Biblioteca',
                        'Validação em tempo real (Reddit e FB)',
                        'Filtros Globais e Inteligência Groq',
                        'Exportação de relatórios em CSV',
                        'Suporte prioritário e badge fundador',
                        'Acesso permanente a atualizações',
                        'Garantia incondicional de 7 dias'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span className={i === 0 || i === 7 ? "text-foreground font-bold" : ""}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 pt-6 border-t border-border/50 space-y-4">
                    <div className="text-xs font-bold text-yellow-500/90 text-center bg-yellow-500/10 py-2 px-4 rounded-lg border border-yellow-500/20">
                      ⚡ Restam apenas 17 vagas com este preço promocional!
                    </div>
                    <a 
                      href={LEMON_SQUEEZY_CHECKOUT_URLS[currency]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/85 w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 cursor-pointer text-center font-bold text-md"
                    >
                      Garantir Acesso Vitalício
                    </a>
                    <div className="text-[11px] text-muted-foreground text-center">Pagamento único e permanente. Processado de forma segura via Lemon Squeezy.</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
              <Lock className="h-4 w-4" />
              <span>Pagamento 100% seguro processado via criptografia SSL oficial</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-24 border-t border-border/50 px-4 md:px-6 bg-muted/20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Perguntas Frequentes</h2>
              <p className="text-muted-foreground text-lg">Tudo que você precisa saber antes de adquirir o ViralBook AI.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Eu preciso saber programar para usar o ViralBook?", a: "Não para encontrar a ideia! O ViralBook vai te dar a ideia de negócio estruturada (O Lean Canvas). Se você não sabe programar, as ideias classificadas como 'Custo de Construção: Baixo' podem ser criadas com ferramentas No-Code (Bubble, FlutterFlow) sem escrever uma linha de código." },
                { q: "O pagamento é mensal ou anual?", a: "Nenhum dos dois. O pagamento é ÚNICO. Você paga uma vez e tem acesso vitalício ao Radar, ao Cofre de Favoritos e a todas as futuras atualizações da plataforma." },
                { q: "Quantas ideias eu posso gerar por dia?", a: "O seu acesso permite a geração ILIMITADA de ideias. Pesquise quantos nichos quiser, leia centenas de livros virtuais e gere infinitos planos de negócios." },
                { q: "E se eu não gostar da ferramenta?", a: "Você está coberto pela nossa Garantia Incondicional de 7 Dias. Se você entrar, rodar o radar e achar que o software não vai colocar dinheiro no seu bolso, basta nos enviar um único e-mail e devolveremos 100% do seu dinheiro, sem perguntas." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-2xl bg-card/30 border border-border/50 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-card/50">
                  <summary className="flex items-center justify-between font-bold text-lg text-foreground outline-none">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed group-open:animate-in group-open:fade-in group-open:slide-in-from-top-1">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-background pt-20 pb-12 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">ViralBook AI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Descubra os oceanos azuis do mercado de software antes que eles fiquem saturados.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">Produto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Preços & Planos</Link></li>
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentação (Docs)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">Empresa</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-primary transition-colors text-left cursor-pointer">Área de Membros</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">Contato</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><ContactModal /></li>
              <li><a href="mailto:suporte@viralbook.ai" className="hover:text-primary transition-colors font-medium text-foreground hover:text-primary transition-colors">suporte@viralbook.ai</a></li>
              <li className="pt-2 text-xs">Atendimento de Seg a Sex, das 09h às 18h.</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ViralBook AI. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Desenvolvido por Indie Hackers para Indie Hackers.</span>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialTab={authTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
