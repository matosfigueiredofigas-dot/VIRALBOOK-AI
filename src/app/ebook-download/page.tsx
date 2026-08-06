"use client";

import { BookOpen, Download, Sparkles, Printer, CheckCircle2, ArrowRight, Zap, Star, ShieldCheck, Clock, Users } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground flex flex-col print:bg-white print:text-black">
      {/* Estilos para Impressão / PDF */}
      <style jsx global>{`
        @media print {
          header, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 12pt !important;
          }
          article {
            page-break-inside: avoid;
            border: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin-bottom: 2rem !important;
          }
          h1, h2, h3, h4 {
            color: black !important;
            page-break-after: avoid;
          }
          .print-break-before {
            page-break-before: always;
          }
        }
      `}</style>

      {/* Header (Escondido no PDF/Impressão) */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md no-print">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">ViralBook AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" className="text-xs font-bold rounded-xl h-9 border-primary/30 hover:bg-primary/10">
            <Printer className="mr-2 h-3.5 w-3.5" />
            {isEn ? "Print / Save PDF" : isEs ? "Imprimir / Guardar PDF" : "Imprimir / Salvar em PDF"}
          </Button>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground text-xs font-bold rounded-xl h-9 shadow-md shadow-primary/20">
              {isEn ? "Access Platform" : isEs ? "Acceder a Plataforma" : "Aceder à Plataforma"}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-12 print:py-0 print:px-0">
        
        {/* Banner do eBook */}
        <div className="rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden text-center md:text-left space-y-6 print:border-none print:shadow-none print:p-0 print:bg-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full pointer-events-none no-print" />
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold uppercase no-print">
            <Sparkles className="h-3.5 w-3.5" />
            {isEn ? "Official eBook — Complete Edition 2025" : isEs ? "eBook Oficial — Edición Completa 2025" : "eBook Oficial — Edição Completa 2025"}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15] print:text-3xl print:text-black">
            LIVROS QUE VALEM MILHÕES <br />
            <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent print:text-black print:bg-none">
              Como Extrair Ideias de Software de Bestsellers e Construir um Micro SaaS Lucrativo
            </span>
          </h1>

          <p className="text-sm font-semibold text-muted-foreground print:text-black">
            Por ViralBook AI · Edição Digital Exclusiva
          </p>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed italic border-l-4 border-primary pl-4 py-1 print:text-black print:border-black">
            "Os melhores produtos de software não nascem de ideias geniais. Nascem de dores reais, já validadas por milhões de leitores."
          </p>

          <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start no-print">
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Download className="mr-2 h-4 w-4" />
              {isEn ? "Download PDF Version" : isEs ? "Descargar Versión PDF" : "Descarregar Versão PDF"}
            </Button>
          </div>
        </div>

        {/* PREFÁCIO */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Prefácio</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Paradoxo do Empreendedor Moderno</h2>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Nunca foi tão fácil construir software. Nunca foi tão difícil saber <strong>o que</strong> construir.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Com ferramentas no-code e IA, qualquer pessoa consegue ter um MVP funcional em 24 a 72 horas. O código deixou de ser a barreira. A barreira agora é a <strong>ideia certa com procura confirmada</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Enquanto milhões de empreendedores perdem meses a adivinhar o que o mercado quer, os leitores de todo o mundo já estão a pagar para aprender a resolver os mesmos problemas através de livros bestsellers. Este guia ensina a ler essa realidade ao contrário: transformar a sabedoria dos livros virais em produtos digitais altamente lucrativos.
          </p>
        </article>

        {/* CAPÍTULO 1 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 1</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Mercado de Livros É o Maior Teste de Mercado do Mundo</h2>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            A Amazon vende mais de <strong>300 milhões de livros por ano</strong>. Cada livro comprado é um voto: uma declaração pública de que alguém tem um problema doloroso o suficiente para pagar por uma solução.
          </p>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 print:border-black print:bg-none">
            <h4 className="font-bold text-foreground text-sm print:text-black">Fórmula Base do ViralBook AI:</h4>
            <code className="text-xs font-bold text-primary block print:text-black">
              Livro Viral + Dor Identificada + Lacuna de Software = Oportunidade de Micro SaaS
            </code>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground print:text-black">
            <p><strong>1. A dor é universal:</strong> Um bestseller indica um mercado massivo que transcende geografias.</p>
            <p><strong>2. O cliente já está educado:</strong> O leitor já conhece o problema e já pagou por uma resposta conceitual.</p>
            <p><strong>3. O timing é perfeito:</strong> Se o livro está a explodir, a procura pelo tema está no auge agora.</p>
          </div>
        </article>

        {/* CAPÍTULO 2 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 2</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">Os 7 Sinais que Revelam um Livro com Potencial de Software</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">1. Processo Repetitivo</h4>
              <p className="text-xs text-muted-foreground print:text-black">O livro descreve rotinas diárias ou semanais que podem ser automatizadas por software.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">2. Listas e Checklists</h4>
              <p className="text-xs text-muted-foreground print:text-black">Muitas tabelas e formulários manuais que o leitor quer digitalizar.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">3. Problema Crónico</h4>
              <p className="text-xs text-muted-foreground print:text-black">Dores recorrentes (como produtividade ou finanças) geram subscrições (SaaS) duradouras.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">4. Comunidade Ativa Online</h4>
              <p className="text-xs text-muted-foreground print:text-black">Subreddits e fóruns discutindo como aplicar os métodos do livro na prática.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">5. Reviews de 3 Estrelas na Amazon</h4>
              <p className="text-xs text-muted-foreground print:text-black">Leituras honestas reclamando: "O conceito é bom, mas é difícil de implementar no dia a dia".</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">6. Categorias de Alta Intenção</h4>
              <p className="text-xs text-muted-foreground print:text-black">Produtividade, Negócios, Finanças, Saúde e Desenvolvimento Pessoal.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1 print:border-black">
            <h4 className="font-bold text-foreground text-sm print:text-black">7. O Autor Não Tem Software Próprio</h4>
            <p className="text-xs text-muted-foreground print:text-black">O autor resolveu a dor no papel; você resolve a dor com tecnologia. Parceria perfeita.</p>
          </div>
        </article>

        {/* CAPÍTULO 3 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 3</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Método de 4 Passos: Da Prateleira ao SaaS</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground print:text-black">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 1: Descoberta</h3>
              <p>Pesquise bestsellers com +50.000 cópias vendidas nos últimos 5 anos em categorias práticas.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 2: Análise da Lacuna</h3>
              <p>Mapeie a dor principal nos reviews de 3 estrelas da Amazon e nas comunidades do Reddit.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 3: Conceção do MVP Mínimo</h3>
              <p>Foque o seu MVP em resolver <strong>apenas uma dor central</strong> com excelência máxima (Regra P0).</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 4: Validação em 48 Horas</h3>
              <p>Crie uma Landing Page simples com formulário de lista de espera. Se conseguir 50 inscrições em 48h, avance!</p>
            </div>
          </div>
        </article>

        {/* CAPÍTULO 4 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 4</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">5 Casos Reais: Livros que se Tornaram Startups de Milhões</h2>
          <ul className="space-y-3 text-sm text-muted-foreground print:text-black">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">Getting Things Done</strong> → Todoist, Things ($500M+ em valor)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">The 4-Hour Work Week</strong> → Zapier ($5B+ em valor)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">You Are a Badass at Money</strong> → YNAB ($100M+ ARR)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">Deep Work</strong> → Freedom App ($10M+ ARR)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">The Lean Startup</strong> → Mixpanel ($865M em valor)
            </li>
          </ul>
        </article>

        {/* CAPÍTULO 5 & 6 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 5 & 6</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Plano de Ação de 48 Horas</h2>
          <div className="space-y-2 text-sm text-muted-foreground print:text-black">
            <p><strong>Horas 0-2:</strong> Encontre o livro no Radar Global do ViralBook AI.</p>
            <p><strong>Horas 2-4:</strong> Documente a dor lendo reviews de 3 estrelas na Amazon.</p>
            <p><strong>Horas 4-8:</strong> Defina o MVP e as funcionalidades P0 (fundamentais).</p>
            <p><strong>Horas 8-24:</strong> Gere a Landing Page com o ViralBook AI.</p>
            <p><strong>Horas 24-48:</strong> Valide nas comunidades e consiga os primeiros 50 inscritos.</p>
          </div>
        </article>

        {/* CTA para o Dashboard (Escondido no PDF) */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/30 text-center space-y-4 no-print">
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
