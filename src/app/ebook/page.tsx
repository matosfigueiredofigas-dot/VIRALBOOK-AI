"use client";

import { useState } from "react";
import { BookOpen, Download, CheckCircle2, ArrowRight, Star, Zap, Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

export default function EbookPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const isEs = language === "es";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ebook/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao subscrever.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Algo correu mal. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = isEn ? [
    "The 7 signs a book hides a million-dollar software",
    "The 4-step method: from bestseller to SaaS in 48h",
    "5 real cases: books that became startups worth billions",
    "The 3 fatal mistakes 90% of founders make",
    "48-hour action plan with ViralBook AI",
  ] : isEs ? [
    "Las 7 señales de que un libro esconde un software millonario",
    "El método de 4 pasos: del bestseller al SaaS en 48h",
    "5 casos reales: libros que se convirtieron en startups millonarias",
    "Los 3 errores fatales que cometen el 90% de los fundadores",
    "Plan de acción de 48 horas con ViralBook AI",
  ] : [
    "Os 7 sinais que revelam um livro com potencial de software",
    "O método de 4 passos: da prateleira ao SaaS em 48h",
    "5 casos reais: livros que se tornaram startups de mil milhões",
    "Os 3 erros fatais que 90% dos fundadores cometem",
    "Plano de ação de 48 horas com o ViralBook AI",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header simples */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/40">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">ViralBook AI</span>
        </Link>
        <Link href="#form" className="text-sm font-bold text-primary hover:underline">
          {isEn ? "Get the free eBook →" : isEs ? "Obtener eBook gratis →" : "Obter eBook grátis →"}
        </Link>
      </header>

      <main className="flex-1">

        {/* Hero */}
        <section className="w-full py-20 md:py-28 px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">

            {/* Texto */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold uppercase tracking-wider">
                <BookOpen className="h-3.5 w-3.5" />
                {isEn ? "Free eBook" : isEs ? "eBook Gratuito" : "eBook Gratuito"}
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                {isEn ? "Books Worth" : isEs ? "Libros que Valen" : "Livros que Valem"}{" "}
                <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent">
                  {isEn ? "Millions" : isEs ? "Millones" : "Milhões"}
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {isEn
                  ? "How to extract Software ideas from Bestsellers and build a profitable Micro SaaS — before writing a single line of code."
                  : isEs
                  ? "Cómo extraer ideas de Software de Bestsellers y construir un Micro SaaS rentable — antes de escribir una sola línea de código."
                  : "Como extrair ideias de Software de Bestsellers e construir um Micro SaaS lucrativo — antes de escrever uma única linha de código."}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  {isEn ? "~90 min read" : isEs ? "~90 min lectura" : "~90 min de leitura"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {isEn ? "6 Chapters" : isEs ? "6 Capítulos" : "6 Capítulos"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Users className="h-4 w-4 text-primary" />
                  {isEn ? "5 Real Cases" : isEs ? "5 Casos Reales" : "5 Casos Reais"}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-500">
                  <Star className="h-4 w-4 fill-current" />
                  {isEn ? "100% Free" : isEs ? "100% Gratis" : "100% Grátis"}
                </div>
              </div>

              {/* Mockup da Capa 3D Cinematográfica */}
              <div className="pt-4 flex items-center gap-6">
                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-w-[140px] shrink-0">
                  <img
                    src="/viralbook_ebook_cover.jpg"
                    alt="Capa Oficial VIRALBOOK AI — Livros que Valem Milhões"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
                <ul className="space-y-2.5">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formulário */}
            <div id="form" className="scroll-mt-24">
              {success ? (
                <div className="rounded-3xl bg-card border border-emerald-500/30 p-10 text-center space-y-4 shadow-2xl">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-foreground">
                    {isEn ? "Check your email!" : isEs ? "¡Revisa tu email!" : "Verifica o teu email!"}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {isEn
                      ? "The eBook is on its way. Check your inbox (and spam folder just in case)."
                      : isEs
                      ? "El eBook está en camino. Revisa tu bandeja de entrada (y la carpeta de spam por si acaso)."
                      : "O eBook está a caminho. Verifica a tua caixa de entrada (e a pasta de spam por precaução)."}
                  </p>
                  <Link href="/dashboard">
                    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 text-sm hover:bg-primary/90 transition-all mt-2">
                      {isEn ? "Access ViralBook AI" : isEs ? "Acceder a ViralBook AI" : "Aceder ao ViralBook AI"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-3xl bg-card border border-border/50 p-8 md:p-10 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

                  <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-extrabold uppercase">
                      <Download className="h-3 w-3" />
                      {isEn ? "Instant Download" : isEs ? "Descarga Inmediata" : "Download Imediato"}
                    </div>
                    <h2 className="text-2xl font-extrabold text-foreground">
                      {isEn ? "Get the free eBook" : isEs ? "Obtener el eBook gratis" : "Obtém o eBook gratuitamente"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isEn ? "No spam. Unsubscribe anytime." : isEs ? "Sin spam. Cancela cuando quieras." : "Sem spam. Cancela quando quiseres."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {isEn ? "Your name (optional)" : isEs ? "Tu nombre (opcional)" : "O teu nome (opcional)"}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isEn ? "e.g. João Silva" : isEs ? "ej. Juan García" : "ex: João Silva"}
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {isEn ? "Your email *" : isEs ? "Tu email *" : "O teu email *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isEn ? "your@email.com" : isEs ? "tu@email.com" : "o.teu@email.com"}
                        className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full h-13 bg-primary text-primary-foreground font-extrabold rounded-xl text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3.5"
                    >
                      {loading ? (
                        <span className="animate-pulse">
                          {isEn ? "Sending..." : isEs ? "Enviando..." : "A enviar..."}
                        </span>
                      ) : (
                        <>
                          <Download className="h-5 w-5" />
                          {isEn ? "Send me the free eBook" : isEs ? "Enviarme el eBook gratis" : "Envia-me o eBook grátis"}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-muted-foreground/60">
                      {isEn
                        ? "By downloading, you agree to receive 6 follow-up emails. Unsubscribe anytime."
                        : isEs
                        ? "Al descargar, aceptas recibir 6 emails de seguimiento. Cancela cuando quieras."
                        : "Ao descarregar, aceitas receber 6 emails de acompanhamento. Cancela quando quiseres."}
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Casos reais */}
        <section className="w-full py-16 bg-muted/10 border-t border-border/40 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              {isEn ? "Inside the eBook: Real Cases" : isEs ? "Dentro del eBook: Casos Reales" : "Dentro do eBook: Casos Reais"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { book: "Getting Things Done", result: "Todoist", value: "$500M+" },
                { book: "The 4-Hour Work Week", result: "Zapier", value: "$5B+" },
                { book: "Deep Work", result: "Freedom", value: "$10M ARR" },
                { book: "The Lean Startup", result: "Mixpanel", value: "$865M" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 text-left space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">📚 {item.book}</p>
                  <p className="text-sm font-extrabold text-foreground">→ {item.result}</p>
                  <p className="text-xs font-bold text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="w-full py-20 px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-foreground">
              {isEn ? "The gold mine is on the shelves." : isEs ? "La mina de oro está en las estanterías." : "A mina de ouro está nas prateleiras."}
            </h2>
            <p className="text-muted-foreground">
              {isEn ? "Get the free eBook and start your 48-hour plan today." : isEs ? "Obtén el eBook gratis y empieza tu plan de 48 horas hoy." : "Obtém o eBook grátis e começa o teu plano de 48 horas hoje."}
            </p>
            <a href="#form">
              <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-extrabold rounded-full h-14 px-10 text-base hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20">
                <Download className="h-5 w-5" />
                {isEn ? "Get the free eBook" : isEs ? "Obtener el eBook gratis" : "Obter o eBook grátis"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 ViralBook AI ·{" "}
          <Link href="/" className="hover:text-primary transition-colors">viralbook-ai.vercel.app</Link>
        </p>
      </footer>
    </div>
  );
}
