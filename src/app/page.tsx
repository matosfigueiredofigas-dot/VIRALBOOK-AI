"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Zap, Target, BookOpen, Lock, CheckCircle2, Eye, EyeOff, Loader2, Sparkles, Clock } from "lucide-react";
import { PricingSection } from "@/components/pricing-section";
import { Button } from "@/components/ui/button";
import { ContactModal } from "@/components/contact-modal";
import { AuthModal } from "@/components/auth-modal";
import { AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { VideoDemo } from "@/components/video-demo";
import { useLanguage } from "@/contexts/language-context";

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Simples */}
      <header className="px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between border-b border-border/40 backdrop-blur-md fixed w-full top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl md:text-2xl tracking-tight text-foreground">ViralBook AI</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="#features" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.featuresNav}
          </Link>
          <Link href="#pricing" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.pricingNav}
          </Link>
          <Link href="/docs" className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            {t.landing.docsNav}
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <button
            onClick={() => openAuth("login")}
            className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center px-3.5 py-1.5 rounded-full hover:bg-muted border border-border/50 cursor-pointer"
          >
            {t.landing.restrictedAccess}
          </button>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex-1 pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="w-full py-10 md:py-16 lg:py-20 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/15 dark:bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="space-y-5 max-w-4xl relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs md:text-sm font-medium text-primary mb-2 animate-pulse">
              {t.landing.heroBadge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-sm leading-[1.15]">
              {t.landing.heroTitlePrefix} <br className="hidden md:block"/>
              <span className="bg-gradient-to-r from-blue-400 via-primary to-purple-500 bg-clip-text text-transparent">
                {t.landing.heroTitleHighlight}
              </span>
            </h1>
            <p className="mx-auto max-w-[750px] text-foreground/90 text-sm md:text-lg/relaxed font-medium mt-5 px-5 py-3 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-md shadow-inner">
              {t.landing.heroSubtitle1}<span className="bg-gradient-to-r from-blue-400 to-primary bg-clip-text text-transparent font-extrabold">{t.landing.heroSubtitle2}</span>{t.landing.heroSubtitle3}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6">
              <button 
                onClick={() => openAuth("signup")}
                className="group/button inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 h-12 px-7 text-sm md:text-base font-bold rounded-full shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_45px_-10px_rgba(59,130,246,0.7)] cursor-pointer"
              >
                {t.landing.heroCtaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <Link 
                href="#pricing" 
                className="group/button inline-flex shrink-0 items-center justify-center bg-muted text-foreground hover:bg-muted/80 h-12 px-6 text-sm md:text-base font-bold rounded-full border border-border/50 transition-all hover:scale-105"
              >
                {t.landing.heroCtaSecondary}
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-10 pt-6 border-t border-border/40 flex flex-col items-center">
              <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">{t.landing.techBadge}</p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-60 hover:opacity-100 transition-all duration-300">
                <div className="flex items-center gap-2 font-bold text-sm md:text-base"><Zap className="h-4 w-4 text-primary"/> Groq AI</div>
                <div className="flex items-center gap-2 font-bold text-sm md:text-base"><BookOpen className="h-4 w-4 text-primary"/> Google Books</div>
                <div className="flex items-center gap-2 font-bold text-sm md:text-base"><Lock className="h-4 w-4 text-primary"/> Supabase</div>
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
        </section>

        {/* Interactive Demo Simulator Section */}
        <section id="demo" className="w-full py-20 bg-background border-t border-border/50 px-4 md:px-6 relative">
          <div className="max-w-6xl mx-auto text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-extrabold text-blue-500 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Workflow do ViralBook AI
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              {t.landing.demoTitle}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.landing.demoSubtitle}
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <VideoDemo onOpenAuth={openAuth} />
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

        {/* Pricing Section */}
        <PricingSection />
      </main>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialTab={authTab} />
    </div>
  );
}
