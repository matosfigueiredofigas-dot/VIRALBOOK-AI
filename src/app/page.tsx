"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState<'USD' | 'BRL' | 'EUR'>('USD');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const resetModalState = () => {
    setLoginError("");
    setSuccessMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setModalMode('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");
    setIsLoggingIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError("E-mail ou senha incorretos.");
        setIsLoggingIn(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setLoginError("Ocorreu um erro ao tentar fazer login.");
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");
    setIsLoggingIn(true);

    if (password !== confirmPassword) {
      setLoginError("As senhas não coincidem.");
      setIsLoggingIn(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });

      if (error) {
        setLoginError(error.message);
      } else {
        setSuccessMessage("Verifique seu e-mail para confirmar o cadastro.");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Erro ao tentar cadastrar.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");
    setIsLoggingIn(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/settings`,
      });

      if (error) {
        setLoginError(error.message);
      } else {
        setSuccessMessage("Link de recuperação enviado para seu e-mail.");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Erro ao enviar recuperação.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError("");
    setSuccessMessage("");
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setLoginError("Erro ao conectar com Google: " + error.message);
        setIsLoggingIn(false);
      }
    } catch (err) {
      console.error(err);
      setLoginError("Erro na autenticação do Google.");
      setIsLoggingIn(false);
    }
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
      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ViralBook AI</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
            Funcionalidades
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
            Preços
          </Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block">
            Documentação
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <button 
            onClick={() => setIsLoginOpen(true)} 
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors flex items-center px-4 py-2 rounded-full hover:bg-white/5 border border-white/5 cursor-pointer bg-transparent"
          >
            Acesso Restrito
          </button>
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
              <Link 
                href="#pricing" 
                className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)]"
              >
                Garantir Meu Acesso Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">Tecnologia de ponta alimentada por</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6"/> Groq AI</div>
                <div className="flex items-center gap-2 font-bold text-xl"><BookOpen className="h-6 w-6"/> Google Books</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Lock className="h-6 w-6"/> Supabase</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-black/40 border-y border-white/5 px-4 md:px-6">
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

        {/* Testimonials Section */}
        <section className="w-full py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">O que dizem os Fundadores</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Quem parou de adivinhar nichos já está construindo negócios de verdade.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Lucas M.", role: "Indie Hacker", text: "Eu perdia semanas tentando validar ideias. O ViralBook encontrou uma dor latente em livros de 'Foco' e eu construí um micro-SaaS em 4 dias. Já tenho meus primeiros 10 clientes pagantes!" },
                { name: "Sofia T.", role: "Desenvolvedora Web", text: "A integração com o Groq é absurdamente rápida. O Lean Canvas que ele gera é tão detalhado que a Vantagem Injusta sugerida virou o slogan da minha nova startup." },
                { name: "Rafael C.", role: "Empreendedor", text: "O melhor investimento do ano. Usar a base do Google Books para achar dores pelas quais as pessoas já pagam para resolver mudou completamente a minha visão de negócios." }
              ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors relative">
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(5)].map((_, j) => <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Escolha seu plano de acesso. <br className="hidden md:block"/>
              Gere seus SaaS com dados.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Selecione o plano ideal para você validar seus projetos. Aproveite nossa oferta especial de lançamento.
            </p>

            {/* Toggle USD / BRL / EUR */}
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
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      currency === c.code
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Card 1: Plano Anual */}
              <div className="glass-card bg-background/50 border border-white/5 rounded-[30px] p-8 md:p-10 flex flex-col justify-between hover:border-white/15 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Plano Anual</h3>
                      <p className="text-sm text-muted-foreground mt-1">Acesso recorrente e estável</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-white/5 border border-white/10 text-muted-foreground rounded-full uppercase tracking-wider">PADRÃO</span>
                  </div>
                  
                  <div className="py-4">
                    <span className="text-muted-foreground line-through text-lg font-medium block">
                      {getPrice('annual', 'original')}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-5xl font-extrabold text-white">
                        {getPrice('annual', 'discount')}
                      </span>
                      <span className="text-muted-foreground text-sm">/ano</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5">
                    {['Acesso ilimitado ao Radar de Tendências', 'Gerador de Oportunidades Infinito', 'Validação no Reddit e Facebook', 'Filtros Globais e Inteligência Groq', 'Exportação de relatórios em CSV', 'Renovação anual recorrente'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-muted-foreground text-sm font-medium">
                        <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <a 
                    href="#checkout-url-anual" 
                    className="group/button inline-flex shrink-0 items-center justify-center bg-white/5 hover:bg-white/10 text-white w-full h-12 text-md font-bold rounded-xl transition-all border border-white/10"
                  >
                    Assinar Plano Anual
                  </a>
                  <div className="text-[11px] text-muted-foreground text-center">Cancele quando quiser. Reembolso em até 7 dias.</div>
                </div>
              </div>

              {/* Card 2: Plano Fundador Vitalício */}
              <div className="p-[2px] rounded-[32px] bg-gradient-to-b from-primary/60 via-primary/30 to-transparent relative group flex flex-col justify-between">
                <div className="absolute inset-0 bg-primary/10 blur-xl rounded-[32px] -z-10 group-hover:bg-primary/20 transition-all duration-700"/>
                <div className="bg-background/90 backdrop-blur-xl rounded-[30px] p-8 md:p-10 flex flex-col justify-between h-full border border-white/5">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                          Membro Vitalício
                        </h3>
                        <p className="text-sm text-primary mt-1">Oferta especial de lançamento</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/20 text-primary rounded-full uppercase tracking-wider">OFERTA LIMITADA</span>
                    </div>
                    
                    <div className="py-4">
                      <span className="text-muted-foreground line-through text-lg font-medium block">
                        {getPrice('lifetime', 'original')}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-5xl font-extrabold text-white">
                          {getPrice('lifetime', 'discount')}
                        </span>
                        <span className="text-muted-foreground text-sm">único</span>
                      </div>
                    </div>

                    <ul className="space-y-3.5">
                      {['Acesso vitalício ilimitado (Sem mensalidades)', 'Gerador de Oportunidades e Biblioteca', 'Validação no Reddit e Facebook', 'Filtros Globais e Inteligência Groq', 'Exportação de relatórios em CSV', 'Suporte prioritário e badge fundador', 'Acesso permanente a todas as atualizações'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                          <span className={i === 0 || i === 6 ? "text-white font-bold" : ""}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    <div className="text-xs font-bold text-yellow-500/90 text-center bg-yellow-500/10 py-1.5 px-3 rounded-lg border border-yellow-500/20">
                      ⚡ Restam apenas 17 vagas com este preço!
                    </div>
                    <a 
                      href="#checkout-url-vitalicio" 
                      className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/85 w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                    >
                      Garantir Acesso Vitalício
                    </a>
                    <div className="text-[11px] text-muted-foreground text-center">Pagamento único e permanente. Sem taxas ocultas.</div>
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
        <section className="w-full py-24 border-t border-white/5 px-4 md:px-6 bg-black/40">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Perguntas Frequentes</h2>
              <p className="text-muted-foreground text-lg">Tudo que você precisa saber antes de adquirir o ViralBook AI.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { q: "Eu preciso saber programar para usar o ViralBook?", a: "Não para encontrar a ideia! O ViralBook vai te dar a ideia de negócio estruturada (O Lean Canvas). Se você não sabe programar, as ideias classificadas como 'Custo de Construção: Baixo' podem ser criadas com ferramentas No-Code (Bubble, FlutterFlow) sem escrever uma linha de código." },
                { q: "O pagamento é mensal ou anual?", a: "Nenhum dos dois. O pagamento é ÚNICO. Você paga uma vez e tem acesso vitalício ao Radar, ao Cofre de Favoritos e a todas as futuras atualizações da plataforma." },
                { q: "Quantas ideias eu posso gerar por dia?", a: "O seu acesso permite a geração ILIMITADA de ideias. Pesquise quantos nichos quiser, leia centenas de livros virtuais e gere infinitos planos de negócios." },
                { q: "E se eu não gostar da ferramenta?", a: "Você está coberto pela nossa Garantia Incondicional de 7 Dias. Se você entrar, rodar o radar e achar que o software não vai colocar dinheiro no seu bolso, basta nos enviar um único e-mail e devolveremos 100% do seu dinheiro, sem perguntas." }
              ].map((faq, i) => (
                <details key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-colors hover:bg-white/[0.04]">
                  <summary className="flex items-center justify-between font-bold text-lg text-white outline-none">
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

      <footer className="border-t border-white/5 bg-background pt-20 pb-12 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">ViralBook AI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Descubra os oceanos azuis do mercado de software antes que eles fiquem saturados.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Produto</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Preços & Planos</Link></li>
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentação (Docs)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Empresa</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
              <li><button onClick={() => setIsLoginOpen(true)} className="hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0 text-muted-foreground text-sm block">Área de Membros</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Contato</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><ContactModal /></li>
              <li><a href="mailto:suporte@viralbook.ai" className="hover:text-primary transition-colors font-medium text-white">suporte@viralbook.ai</a></li>
              <li className="pt-2 text-xs">Atendimento de Seg a Sex, das 09h às 18h.</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ViralBook AI. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <span>Desenvolvido por Indie Hackers para Indie Hackers.</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-card/60 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-foreground">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsLoginOpen(false);
                resetModalState();
              }}
              className="absolute top-5 right-5 text-muted-foreground hover:text-white transition-colors text-sm px-2.5 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              ✕
            </button>

            {/* Title / Header */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
                {modalMode === 'login' && "Entrar na Conta"}
                {modalMode === 'signup' && "Criar Conta"}
                {modalMode === 'forgot' && "Recuperar Senha"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {modalMode === 'login' && "Acesse o painel restrito do ViralBook AI"}
                {modalMode === 'signup' && "Cadastre-se para começar a mapear micro-SaaS"}
                {modalMode === 'forgot' && "Insira seu e-mail para receber um link de redefinição"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={
              modalMode === 'login' ? handleLogin : 
              modalMode === 'signup' ? handleSignUp : 
              handleResetPassword
            } className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block text-left" htmlFor="modal-email">
                  E-mail
                </label>
                <input
                  id="modal-email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                  disabled={isLoggingIn}
                />
              </div>

              {(modalMode === 'login' || modalMode === 'signup') && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-muted-foreground block text-left" htmlFor="modal-password">
                      Senha
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="modal-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                      disabled={isLoggingIn}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-2.5 right-3 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {modalMode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground block text-left" htmlFor="modal-confirm-password">
                    Confirmar Senha
                  </label>
                  <input
                    id="modal-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                    disabled={isLoggingIn}
                  />
                </div>
              )}

              {loginError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-xs font-semibold text-center animate-in fade-in duration-300">
                  {loginError}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-green-500/10 border border-green-500/25 rounded-xl text-green-500 text-xs font-semibold text-center animate-in fade-in duration-300">
                  {successMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/10 mt-6 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Aguarde...
                  </>
                ) : (
                  <>
                    {modalMode === 'login' && "Entrar no Painel"}
                    {modalMode === 'signup' && "Cadastrar Conta"}
                    {modalMode === 'forgot' && "Enviar Link de Recuperação"}
                  </>
                )}
              </Button>
            </form>

            {/* Google Login Divider and Button */}
            {(modalMode === 'login' || modalMode === 'signup') && (
              <>
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card/60 backdrop-blur-2xl px-3 text-muted-foreground">Ou continuar com</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full h-11 bg-white/5 border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
              </>
            )}

            {/* Links Section */}
            <div className="mt-6 flex flex-col gap-2.5 text-center text-xs">
              {modalMode === 'login' ? (
                <>
                  <div className="flex justify-between items-center px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode('forgot');
                        setLoginError("");
                        setSuccessMessage("");
                      }}
                      className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode('signup');
                        setLoginError("");
                        setSuccessMessage("");
                      }}
                      className="text-primary hover:text-primary/80 font-semibold cursor-pointer"
                    >
                      Criar uma conta
                    </button>
                  </div>
                </>
              ) : modalMode === 'signup' ? (
                <p className="text-muted-foreground">
                  Já possui uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode('login');
                      setLoginError("");
                      setSuccessMessage("");
                    }}
                    className="text-primary hover:text-primary/80 font-bold ml-1 cursor-pointer"
                  >
                    Faça login
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Lembrou sua senha?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode('login');
                      setLoginError("");
                      setSuccessMessage("");
                    }}
                    className="text-primary hover:text-primary/80 font-bold ml-1 cursor-pointer"
                  >
                    Voltar para o login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
