"use client";

import { BookOpen, Download, Sparkles, Printer, CheckCircle2, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export default function EbookDownloadPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isEs = language === "es";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">ViralBook AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" className="text-xs font-bold rounded-xl h-9">
            <Printer className="mr-2 h-3.5 w-3.5" />
            {isEn ? "Print / Save PDF" : isEs ? "Imprimir / Guardar PDF" : "Imprimir / Salvar em PDF"}
          </Button>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground text-xs font-bold rounded-xl h-9">
              {isEn ? "Access Platform" : isEs ? "Acceder a Plataforma" : "Aceder à Plataforma"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Banner do eBook */}
        <div className="rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden text-center md:text-left space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            {isEn ? "Official eBook — Complete Edition" : isEs ? "eBook Oficial — Edición Completa" : "eBook Oficial — Edição Completa"}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            {isEn ? "Books Worth Millions:" : isEs ? "Libros que Valen Millones:" : "Livros que Valem Milhões:"} <br />
            <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent">
              {isEn ? "From Bestsellers to Micro SaaS" : isEs ? "De Bestsellers a Micro SaaS" : "De Bestsellers a Micro SaaS"}
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {isEn
              ? "The step-by-step guide to reverse engineering validated market demand from viral books into high-profit digital products."
              : isEs
              ? "La guía paso a paso para hacer ingeniería inversa de demandas validadas a partir de libros virales."
              : "O guia passo a passo para fazer engenharia inversa de demandas validadas a partir de livros virais e construir softwares altamente lucrativos."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Download className="mr-2 h-4 w-4" />
              {isEn ? "Download PDF Version" : isEs ? "Descargar Versión PDF" : "Descarregar Versão PDF"}
            </Button>
          </div>
        </div>

        {/* Capítulo 1 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {isEn ? "Chapter 1" : isEs ? "Capítulo 1" : "Capítulo 1"}
          </span>
          <h2 className="text-2xl font-black text-foreground">
            {isEn ? "The Philosophy of Zero-Risk Pre-Selling" : isEs ? "La Filosofía del Pré-Sell sin Riesgo" : "A Filosofia da Pré-Venda Zero Risco"}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {isEn
              ? "Traditional startups waste 6 months coding a product before asking if anyone wants it. ViralBook AI reverses this framework: we identify non-fiction bestsellers where millions of readers have already paid to solve a problem, and build the software bridge to automate that solution."
              : isEs
              ? "Las startups tradicionales pierden 6 meses programando antes de validar la demanda. ViralBook AI invierte la lógica: identificamos bestsellers donde millones de lectores ya pagaron por resolver su problema."
              : "Startups tradicionais perdem 6 meses desenvolvendo software antes de saberem se alguém vai comprar. O ViralBook AI inverte essa lógica: identificamos bestsellers onde milhões de leitores já pagaram para resolver a sua dor."}
          </p>
        </article>

        {/* Capítulo 2 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {isEn ? "Chapter 2" : isEs ? "Capítulo 2" : "Capítulo 2"}
          </span>
          <h2 className="text-2xl font-black text-foreground">
            {isEn ? "The 7 Bestseller Opportunity Indicators" : isEs ? "Las 7 Señales de Oportunidad en Bestsellers" : "Os 7 Sinais de Oportunidade em Bestsellers"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <h4 className="font-bold text-foreground text-sm">1. Process Repetition</h4>
              <p className="text-xs text-muted-foreground">The book asks readers to do daily or weekly routines that can be automated.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <h4 className="font-bold text-foreground text-sm">2. 3-Star Amazon Reviews</h4>
              <p className="text-xs text-muted-foreground">Readers complain about lack of practical templates or daily tracking tools.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <h4 className="font-bold text-foreground text-sm">3. No Author Tech Product</h4>
              <p className="text-xs text-muted-foreground">Author has sold 500k+ copies but has no official companion app.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1">
              <h4 className="font-bold text-foreground text-sm">4. Active Reddit Communities</h4>
              <p className="text-xs text-muted-foreground">Dedicated subreddits sharing manual spreadsheets and Notion templates.</p>
            </div>
          </div>
        </article>

        {/* Capítulo 3 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {isEn ? "Chapter 3" : isEs ? "Capítulo 3" : "Capítulo 3"}
          </span>
          <h2 className="text-2xl font-black text-foreground">
            {isEn ? "5 Bestseller-to-SaaS Billion-Dollar Case Studies" : isEs ? "5 Casos Reales: De Libro a Startup" : "5 Casos Reais: De Livro a Startup"}
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /><strong className="text-foreground">Getting Things Done</strong> → Todoist ($500M+ Valuation)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /><strong className="text-foreground">The 4-Hour Work Week</strong> → Zapier ($5B+ Valuation)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /><strong className="text-foreground">Deep Work</strong> → Freedom App ($10M ARR)</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /><strong className="text-foreground">The Lean Startup</strong> → Mixpanel ($865M Valuation)</li>
          </ul>
        </article>

        {/* CTA para o Dashboard */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/30 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-foreground">
            {isEn ? "Ready to Automate This Entire Method?" : isEs ? "¿Listo para Automatizar Todo el Método?" : "Pronto para Automatizar Todo Este Método?"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {isEn
              ? "ViralBook AI automates book mining, Lean Canvas generation, 8-Mentor advisory, and Landing Page deployment."
              : isEs
              ? "ViralBook AI automatiza la minería de libros, geração de Lean Canvas, mentoría y criação de Landing Pages."
              : "O ViralBook AI automatiza a mineração de livros, geração de Lean Canvas, mentoria de 8 mentores e criação de Landing Pages."}
          </p>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
              {isEn ? "Access Platform Now" : isEs ? "Acceder a Plataforma Ahora" : "Aceder à Plataforma Agora"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
