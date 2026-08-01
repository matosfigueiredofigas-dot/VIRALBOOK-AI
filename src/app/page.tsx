"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2, Eye, EyeOff, Loader2, Play, Clock } from "lucide-react";
import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { AuthModal } from "@/components/auth-modal";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { VideoDemo } from "@/components/video-demo";
import { useLanguage } from "@/contexts/language-context";

const LEMON_SQUEEZY_CHECKOUT_URLS = {
  basic: {
    USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_USD_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-usd-id",
    BRL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_BRL_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-brl-id",
    EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_EUR_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-eur-id"
  },
  pro: {
    USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_USD_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-usd-id",
    BRL: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_BRL_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-brl-id",
    EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_EUR_URL || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/your-eur-id"
  }
};

export default function LandingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';
  const [currency, setCurrency] = useState<'USD' | 'BRL' | 'EUR'>('USD');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup" | "forgot">("login");

  const openAuth = (tab: "login" | "signup" | "forgot" = "login") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getPrice = (tier: 'basic' | 'pro', type: 'original' | 'discount') => {
    if (tier === 'basic') {
      if (type === 'original') {
        if (currency === 'USD') return '$ 29';
        if (currency === 'EUR') return '29 €';
        return 'R$ 147';
      } else {
        if (currency === 'USD') return '$ 9';
        if (currency === 'EUR') return '9 €';
        return 'R$ 47';
      }
    }
    if (tier === 'pro') {
      if (type === 'original') {
        if (currency === 'USD') return '$ 69';
        if (currency === 'EUR') return '69 €';
        return 'R$ 397';
      } else {
        if (currency === 'USD') return '$ 19';
        if (currency === 'EUR') return '19 €';
        return 'R$ 97';
      }
    }
    return '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Simples */}
      <header className="px-6 lg:px-14 h-24 flex items-center justify-between border-b border-border/40 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <span className="font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">ViralBook AI</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.featuresNav}
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.pricingNav}
          </Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.docsNav}
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <button
            onClick={() => openAuth("login")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center px-4 py-2 rounded-full hover:bg-muted border border-border/50 cursor-pointer"
          >
            {t.landing.restrictedAccess}
          </button>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/15 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 max-w-4xl relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 animate-pulse">
              {t.landing.heroBadge}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground drop-shadow-sm leading-[1.1]">
              {t.landing.heroTitlePrefix} <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">
                {t.landing.heroTitleHighlight}
              </span>
            </h1>
            <p className="mx-auto max-w-[800px] text-foreground/95 md:text-2xl/relaxed font-medium mt-8 px-6 py-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md shadow-inner">
              {t.landing.heroSubtitle1}<span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent font-extrabold">{t.landing.heroSubtitle2}</span>{t.landing.heroSubtitle3}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button 
                onClick={() => openAuth("signup")}
                className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 h-14 px-8 text-lg font-bold rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.8)] cursor-pointer"
              >
                {t.landing.heroCtaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <Link 
                href="#demo" 
                className="group/button inline-flex shrink-0 items-center justify-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 h-14 px-8 text-lg font-bold rounded-full border border-blue-500/30 transition-all hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5 fill-current" /> {t.landing.demoBtn}
              </Link>
              <Link 
                href="#pricing" 
                className="group/button inline-flex shrink-0 items-center justify-center bg-muted text-foreground hover:bg-muted/80 h-14 px-8 text-lg font-bold rounded-full border border-border/50 transition-all hover:scale-105"
              >
                {t.landing.heroCtaSecondary}
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 pt-8 border-t border-border/40 flex flex-col items-center">
              <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-widest">{t.landing.techBadge}</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6"/> Groq AI</div>
                <div className="flex items-center gap-2 font-bold text-xl"><BookOpen className="h-6 w-6"/> Google Books</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Lock className="h-6 w-6"/> Supabase</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pain & Solution Section */}
        <section className="w-full py-20 bg-muted/10 border-t border-border/50 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[250px] bg-red-500/5 dark:bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-stretch relative z-10">
            {/* Pain Column */}
            <div className="p-8 md:p-10 rounded-3xl bg-red-500/5 border border-red-500/10 flex flex-col justify-between transition-all hover:border-red-500/20">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 flex items-center gap-2">
                  <span className="text-red-500">{t.landing.painTitle}</span>
                </h3>
                <ul className="space-y-4">
                  {t.landing.painList.map((pain, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base leading-snug min-h-[44px] pt-1.5">
                      <span className="text-lg shrink-0">❌</span>
                      <span>{pain}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Relief Column */}
            <div className="p-8 md:p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-between transition-all hover:border-emerald-500/20">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6 flex items-center gap-2">
                  <span className="text-emerald-500">{t.landing.solutionTitle}</span>
                </h3>
                <ul className="space-y-4">
                  {t.landing.solutionList.map((sol, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground font-semibold text-sm md:text-base leading-snug min-h-[44px] pt-1.5">
                      <span className="text-lg shrink-0">✅</span>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center relative z-10">
            <Link 
              href="#demo"
              className="inline-flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 text-base font-bold rounded-full shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <Play className="mr-2 h-4 w-4 fill-current" /> {t.landing.demoBtn}
            </Link>
          </div>
        </section>

        {/* Interactive Demo Simulator Section */}
        <section id="demo" className="w-full py-20 bg-background border-t border-border/50 px-4 md:px-6 relative">
          <div className="max-w-6xl mx-auto text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-extrabold text-blue-500 uppercase tracking-wider">
              <Play className="h-3.5 w-3.5 fill-current" /> {t.landing.demoBadge}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {t.landing.demoTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.landing.demoSubtitle}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <VideoDemo />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-muted/20 border-y border-border/50 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t.landing.featuresTitle}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t.landing.featuresSubtitle}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/20 dark:border-blue-500/30">
                  <Target className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{t.landing.feature1Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature1Desc}
                </p>
              </div>

              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20 dark:border-purple-500/30">
                  <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{t.landing.feature2Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature2Desc}
                </p>
              </div>

              <div className="p-8 rounded-3xl glass-card transition-all hover:-translate-y-1">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/20 dark:border-emerald-500/30">
                  <Lock className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{t.landing.feature3Title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t.landing.feature3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section — componente completo com toggle mensal/anual, LTD e multi-moeda */}
        <PricingSection />
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
              ViralBook AI
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">Nav</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">{t.landing.featuresNav}</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">{t.landing.pricingNav}</Link></li>
              <li><Link href="/docs" className="hover:text-primary transition-colors">{t.landing.docsNav}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">{isEn ? "Legal" : isEs ? "Legal" : "Legal"}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">{isEn ? "Terms of Use" : isEs ? "Términos de Uso" : "Termos de Uso"}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{isEn ? "Privacy Policy" : isEs ? "Política de Privacidad" : "Política de Privacidade"}</Link></li>
              <li><button onClick={() => openAuth("login")} className="hover:text-primary transition-colors text-left cursor-pointer">{t.landing.restrictedAccess}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase text-sm tracking-wider">{isEn ? "Contact" : isEs ? "Contacto" : "Contato"}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><ContactModal /></li>
              <li><a href="mailto:suporte@viralbook.ai" className="hover:text-primary transition-colors font-medium text-foreground">suporte@viralbook.ai</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ViralBook AI. All rights reserved.</p>
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
