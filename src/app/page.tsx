"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2, Crosshair, Briefcase, Mail, TerminalSquare } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";
import { AnimatePresence, motion } from "framer-motion";

const LEMON_SQUEEZY_CHECKOUT_URLS = {
  USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-usd-id",
  BRL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-brl-id",
  EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-eur-id"
};

export default function LandingPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<'USD' | 'BRL' | 'EUR'>('BRL');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "forgot">("login");

  // Force dark mode on this page to guarantee the Ultra Premium look
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const openAuth = (tab: "login" | "signup" | "forgot" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const getPrice = (type: 'original' | 'discount') => {
    if (type === 'original') {
      if (currency === 'USD') return '$ 897 único';
      if (currency === 'EUR') return '897 € único';
      return 'R$ 2.997 único';
    } else {
      if (currency === 'USD') return '$ 297';
      if (currency === 'EUR') return '297 €';
      return 'R$ 997';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-cyan-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        <div className="absolute top-[-10%] left-1/4 w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-1/4 w-[40vw] h-[40vw] bg-fuchsia-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

      {/* Header */}
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between border-b border-white/5 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">Viralbook AI</span>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => openAuth("login")}
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center px-5 py-2.5 rounded-full hover:bg-white/5 border border-white/10 cursor-pointer"
          >
            Acesso Restrito
          </button>
        </nav>
      </header>

      <main className="flex-1 pt-32 pb-24 relative z-10 flex flex-col items-center px-4 md:px-6">
        
        {/* VSL Hero Section */}
        <section className="w-full max-w-5xl flex flex-col items-center justify-center text-center space-y-8 mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-400 uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            ⚡ Fechando em Breve: Vagas de Fundador
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg leading-[1.1]"
          >
            Roube as ideias bilionárias de <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
              livros Best-Sellers em 5 segundos.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-3xl text-zinc-400 md:text-xl font-medium mt-4"
          >
            O primeiro "SaaS in a Box" alimentado por inteligência artificial militar. Encontre oceanos azuis, gere código SQL, crie anúncios e lance funis de e-mail antes do seu concorrente acordar.
          </motion.p>

          {/* VSL Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-full max-w-4xl mt-12 aspect-video rounded-[32px] p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-[30px] border border-white/5 transition-all group-hover:bg-zinc-950/60">
              <div className="h-24 w-24 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 cursor-pointer shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-transform hover:scale-110">
                <Play className="h-10 w-10 text-cyan-400 ml-2" />
              </div>
              <p className="mt-6 font-bold text-lg text-white">Clique para ver a Mágica na Prática (VSL)</p>
              <p className="text-sm text-zinc-500 mt-2">Duração: 05:42 • Assista antes que saia do ar</p>
            </div>
            {/* Faux Interface Background */}
            <div className="absolute inset-2 rounded-[28px] bg-zinc-900 border border-white/5 opacity-50 flex items-center justify-center">
              {/* This represents what the user will put here (a screen recording of the app) */}
              <div className="animate-pulse w-3/4 h-3/4 bg-white/5 rounded-2xl border border-white/5" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-4xl mt-8 pt-8"
          >
            <Link 
              href="#pricing"
              className="group inline-flex shrink-0 items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 h-16 px-10 text-xl font-extrabold rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
            >
              Quero Acesso Vitalício Agora <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        {/* Show Don't Tell - Feature Showcase */}
        <section className="w-full max-w-6xl mt-40 space-y-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">Não é um "Chatbot". É o seu CTO.</h2>
            <p className="text-zinc-400 text-lg">Um ecossistema fechado de ferramentas operacionais.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                <Crosshair className="h-7 w-7 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">Hunter AI: Prospecção B2B</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Deixe o Hunter AI raspar a internet por você. Ele gera Google Dorks hackers, scripts de LinkedIn e Cold Emails impossíveis de serem ignorados. Tudo perfeitamente formatado para o seu exato micro-nicho.
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-square rounded-[32px] bg-zinc-900 border border-white/10 p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="w-full h-full bg-zinc-950 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 font-mono text-sm text-cyan-400 shadow-inner">
                  <div className="flex gap-2 items-center border-b border-white/10 pb-4"><TerminalSquare className="w-5 h-5"/> <span>Terminal de Busca</span></div>
                  <p className="text-zinc-500">Executing Dork...</p>
                  <p className="text-green-400">&gt; site:linkedin.com/in/ "Diretor" AND "SaaS"</p>
                  <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-zinc-300">"Subject: A dor do iFood..."</p>
                    <p className="text-zinc-500 mt-2">Corpo gerado. Focado em conversão brutal.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="aspect-square rounded-[32px] bg-zinc-900 border border-white/10 p-6 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="w-full h-full bg-zinc-950 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
                  <div className="w-full h-32 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <span className="font-bold text-fuchsia-400 font-mono">Meta Ads Mockup</span>
                  </div>
                  <div className="w-full flex-1 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                    <span className="font-bold text-fuchsia-400 font-mono">TikTok Script Block</span>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/30">
                <Briefcase className="h-7 w-7 text-fuchsia-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">Ad Factory Pro</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Você nunca mais vai sofrer com "página em branco". A IA desenha a cópia exata do seu anúncio no Facebook e estrutura o roteiro segundo a segundo para reter atenção máxima no TikTok/Reels.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing: The Lifetime Deal */}
        <section id="pricing" className="w-full py-32 mt-20 relative">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Acesso Antecipado. <br />
              <span className="text-zinc-500">Pague uma vez. Use para sempre.</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Estamos fechando o grupo de fundadores em breve. Depois disso, o Viralbook passará a custar R$ 297/mês.
            </p>

            {/* Moedas */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                {[
                  { code: 'BRL', label: 'BRL (R$)' },
                  { code: 'USD', label: 'USD ($)' },
                  { code: 'EUR', label: 'EUR (€)' }
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code as 'USD' | 'BRL' | 'EUR')}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-wider ${
                      currency === c.code
                        ? 'bg-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* O Card do LTD */}
            <div className="mx-auto w-full max-w-2xl p-[2px] rounded-[40px] bg-gradient-to-b from-white/20 via-white/5 to-transparent relative group">
              <div className="absolute inset-0 bg-white/5 blur-2xl rounded-[40px] -z-10 transition-all duration-700 group-hover:bg-white/10"/>
              
              <div className="bg-zinc-950/90 backdrop-blur-3xl rounded-[38px] p-8 md:p-14 border border-white/10 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Zap className="w-48 h-48 text-cyan-400" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-3xl font-extrabold text-white">Lifetime Deal</h3>
                        <p className="text-cyan-400 mt-2 font-bold text-sm uppercase tracking-widest">Passe de Fundador VIP</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 uppercase animate-pulse">
                            🔥 17 VAGAS RESTANTES
                        </span>
                    </div>
                    </div>
                    
                    <div className="py-6 border-y border-white/10 mb-8">
                    <span className="text-zinc-600 line-through text-lg font-medium block">
                        {getPrice('original')}
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-6xl font-extrabold text-white tracking-tight">
                        {getPrice('discount')}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-emerald-400 mt-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4"/> Pagamento único. Sem surpresas mensais.
                    </p>
                    </div>

                    <ul className="grid gap-4 mb-10">
                    {[
                        'Radar 3D & Nichos Globais Ilimitados',
                        'SaaS Canvas (Geração Inteligente via Groq)',
                        'Hunter B2B (Dorks & Cold Emails)',
                        'Ad Factory Pro (Meta & TikTok)',
                        'Email Matrix Funnels',
                        'Acesso ao Conselho de Holo-Mentores',
                        'Atualizações Vitalícias Inclusas',
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                        <Zap className="h-5 w-5 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                        </li>
                    ))}
                    </ul>

                    <a 
                    href={LEMON_SQUEEZY_CHECKOUT_URLS[currency]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center bg-white text-zinc-950 hover:bg-zinc-200 h-16 text-lg font-extrabold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform hover:-translate-y-1"
                    >
                    Garantir Acesso Vitalício
                    </a>
                    
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600 font-medium">
                    <Lock className="h-4 w-4" />
                    <span>Criptografia SSL de 256 bits via Lemon Squeezy</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 pt-12 pb-12 px-6 lg:px-14 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 font-medium">
           <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-zinc-700"/>
            <span>© {new Date().getFullYear()} Viralbook AI. Reservados.</span>
           </div>
           <div className="flex gap-6">
             <Link href="/terms" className="hover:text-white transition-colors">Termos</Link>
             <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
             <a href="mailto:ceo@viralbook.ai" className="hover:text-white transition-colors">Contato</a>
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
