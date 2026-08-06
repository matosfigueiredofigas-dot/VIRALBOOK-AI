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
            font-size: 11pt !important;
            line-height: 1.6 !important;
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

      {/* Header Sticky (Escondido no PDF/Impressão) */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md no-print">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-foreground">ViralBook AI</span>
        </Link>
        <div className="flex items-center gap-3">
          <a href="/Livros_Que_Valem_Milhoes_ViralBook_AI.pdf" download="Livros_Que_Valem_Milhoes_ViralBook_AI.pdf">
            <Button variant="outline" className="text-xs font-bold rounded-xl h-9 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Download className="mr-2 h-3.5 w-3.5" />
              {isEn ? "Download PDF (Master Edition)" : isEs ? "Descargar PDF (Edición Master)" : "Descarregar PDF (Edição Master)"}
            </Button>
          </a>
          <Button onClick={handlePrint} variant="ghost" className="text-xs font-bold rounded-xl h-9">
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            {isEn ? "Print" : isEs ? "Imprimir" : "Imprimir"}
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
        
        {/* Banner do eBook Master com Capa Cinematográfica */}
        <div className="rounded-3xl bg-gradient-to-br from-card via-card/90 to-primary/10 p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden space-y-6 print:border-none print:shadow-none print:p-0 print:bg-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full pointer-events-none no-print" />
          
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold uppercase no-print">
                <Sparkles className="h-3.5 w-3.5" />
                Edição Master Ampliada · Capa Cinematográfica 3D · Guia 2025
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15] print:text-3xl print:text-black">
                LIVROS QUE VALEM MILHÕES <br />
                <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent print:text-black print:bg-none">
                  Como Extrair Ideias de Software de Bestsellers
                </span>
              </h1>

              <p className="text-sm font-semibold text-muted-foreground print:text-black">
                Por ViralBook AI · Edição Digital Exclusiva (2025)
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-1 print:text-black print:border-black">
                "Os melhores produtos de software não nascem de ideias geniais inventadas no vácuo. Nascem de dores profundas e reais, já validadas por milhões de leitores."
              </p>

              <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start no-print">
                <a href="/Livros_Que_Valem_Milhoes_ViralBook_AI.pdf" download="Livros_Que_Valem_Milhoes_ViralBook_AI.pdf">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 px-7 shadow-lg shadow-emerald-600/20 text-sm">
                    <Download className="mr-2.5 h-5 w-5" />
                    Descarregar Ficheiro PDF Completo (.pdf)
                  </Button>
                </a>
                <Button onClick={handlePrint} variant="outline" className="font-bold rounded-xl h-12 px-6 text-sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir / Guardar em PDF
                </Button>
              </div>
            </div>

            {/* Imagem de Capa Cinematográfica (Mockup 3D) */}
            <div className="no-print flex justify-center">
              <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-500 hover:scale-105 max-w-[220px]">
                <img
                  src="/viralbook_ebook_cover.jpg"
                  alt="Capa Oficial VIRALBOOK AI — Livros que Valem Milhões"
                  className="w-full h-auto object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-yellow-400" />
                    Edição Master em PDF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PREFÁCIO */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Prefácio</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Paradoxo do Empreendedor Moderno</h2>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Estamos a viver a era mais fascinante e ao mesmo tempo mais perigosa da história do desenvolvimento de software. Nunca foi tão fácil construir uma aplicação web, um Micro SaaS ou uma extensão. Com ferramentas no-code, editores inteligentes como Cursor e IA generativa, qualquer pessoa consegue transformar uma ideia num produto funcional em 24 a 72 horas.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            No entanto, esta democratização criou um paradoxo devastador: <strong>Nunca foi tão fácil construir software. Mas nunca foi tão difícil saber O QUE construir.</strong> A barreira técnica ruiu; a nova barreira crítica é a validação real da procura de mercado.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Diariamente, milhares de empreendedores passam semanas fechados nos seus quartos a desenvolver produtos que ninguém quer comprar. A metodologia <strong>ViralBook AI</strong> inverte esta lógica por completo: não invente a dor. Encontre a dor onde ela já foi paga por milhões de leitores.
          </p>
        </article>

        {/* CAPÍTULO 1 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 1</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Mercado de Livros É o Maior Teste de Mercado do Mundo</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground print:text-black">
            <h3 className="text-lg font-bold text-foreground print:text-black">1.1 A Psicologia da Compra de Não-Ficção</h3>
            <p>
              A Amazon vende mais de <strong>300 milhões de livros por ano</strong>. Quando um consumidor paga $15 a $30 por um livro de não-ficção, ele não está a comprar papel. Ele está a admitir explicitamente que tem um problema doloroso e a pagar por uma solução.
            </p>
            <p>
              Quando <em>Atomic Habits</em> de James Clear vendeu mais de 15 milhões de cópias, não foi porque as pessoas adoram ler. Foi porque 15 milhões de pessoas têm um problema com hábitos e pagaram para o resolver. Essa dor está validada e é massiva.
            </p>

            <h3 className="text-lg font-bold text-foreground print:text-black">1.2 O Volume de Dados Oculto na Amazon e Kindle</h3>
            <p>
              Dentro da Amazon existem fontes de dados valiosas: os <strong>Highlights do Kindle</strong> (revelam o momento Eureca!), os <strong>Reviews de 3 Estrelas</strong> (a maior fonte de queixas operacionais e desejos de ferramentas) e as seções de perguntas dos leitores.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 print:border-black print:bg-none">
            <h4 className="font-bold text-foreground text-sm print:text-black">Fórmula Base da Oportunidade:</h4>
            <code className="text-xs font-bold text-primary block print:text-black">
              Valor do SaaS = (Dor Validada pelo Livro) × (Automação do Processo) × (Economia de Tempo)
            </code>
          </div>
        </article>

        {/* CAPÍTULO 2 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 2</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">Os 7 Sinais que Indicam um Livro com Potencial Milionário</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">1. Processo Repetitivo</h4>
              <p className="text-xs text-muted-foreground print:text-black">Rotinas diárias ou semanais que geram fadiga manual no leitor (ex: método GTD de David Allen).</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">2. Tabelas e Checklists</h4>
              <p className="text-xs text-muted-foreground print:text-black">Abundância de tabelas e listas impressas que clamam por uma interface digital.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">3. Problema Crónico</h4>
              <p className="text-xs text-muted-foreground print:text-black">Dores recorrentes (como finanças ou procrastinação) geram subscrições SaaS de baixo churn.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">4. Comunidades Ativas Online</h4>
              <p className="text-xs text-muted-foreground print:text-black">Subreddits e fóruns discutindo como aplicar os métodos do livro na prática cotidiana.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">5. Reviews de 3 Estrelas</h4>
              <p className="text-xs text-muted-foreground print:text-black">Leituras exigentes reclamando da falta de ferramentas práticas de acompanhamento.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">6. Categorias de Alta Intenção</h4>
              <p className="text-xs text-muted-foreground print:text-black">Produtividade, Negócios, Finanças Pessoais, Saúde e Desenvolvimento Pessoal.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1 print:border-black">
            <h4 className="font-bold text-foreground text-sm print:text-black">7. Autor sem Software Próprio</h4>
            <p className="text-xs text-muted-foreground print:text-black">O autor resolveu o problema intelectualmente; você resolve-o tecnologicamente.</p>
          </div>
        </article>

        {/* CAPÍTULO 3 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 3</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Método de 4 Passos: Da Prateleira ao SaaS em 48h</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground print:text-black">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 1: Descoberta Estruturada</h3>
              <p>Filtre livros com +50.000 cópias vendidas, avaliação entre 4.1 e 4.7 e publicação nos últimos 5 anos.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 2: Análise da Lacuna</h3>
              <p>Mapeie os highlights do Kindle e reviews de 3 estrelas para formular a tese de dor do produto.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 3: MVP com Regra P0</h3>
              <p>Foque o seu protótipo em resolver <strong>apenas 1 dor central</strong> com velocidade e simplicidade extrema.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Passo 4: Validação em 48 Horas</h3>
              <p>Publique uma Landing Page de lista de espera nas comunidades. Se alcançar +50 inscrições, avance!</p>
            </div>
          </div>
        </article>

        {/* CAPÍTULO 4 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 4</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">5 Casos Reais: De Livros a Startups de Sucesso</h2>
          <ul className="space-y-3 text-sm text-muted-foreground print:text-black">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">Getting Things Done</strong> (David Allen) → Todoist & Things3 ($500M+ em valor)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">The 4-Hour Work Week</strong> (Tim Ferriss) → Zapier ($5B+ em valor)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">You Are a Badass at Money</strong> (Jen Sincero) → YNAB ($100M+ ARR)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">Deep Work</strong> (Cal Newport) → Freedom App & Forest ($10M+ ARR)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 print:text-black" />
              <strong className="text-foreground print:text-black">The Lean Startup</strong> (Eric Ries) → Mixpanel & Hotjar ($865M em valor)
            </li>
          </ul>
        </article>

        {/* CAPÍTULO 5 & 6 */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Capítulo 5 & 6</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">Os 3 Erros Fatais & O Plano de Ação de 48 Horas</h2>
          <div className="space-y-3 text-sm text-muted-foreground print:text-black">
            <p><strong>Erro 1:</strong> Construir antes de vender. A sequência correta é: Dor → Validar → Vender → Construir.</p>
            <p><strong>Erro 2:</strong> Tentar resolver todas as dores do livro de uma só vez no MVP.</p>
            <p><strong>Erro 3:</strong> Não falar com as comunidades de leitores antes de programar.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 print:border-black">
            <h4 className="font-bold text-emerald-400 text-sm print:text-black">Plano de 48 Horas com o ViralBook AI:</h4>
            <p className="text-xs text-muted-foreground print:text-black">
              Sábado de Manhã (Descoberta) → Sábado à Tarde (Análise da Dor) → Sábado à Noite (Landing Page) → Domingo (Divulgação & 50 Leads).
            </p>
          </div>
        </article>

        {/* CTA final no fim da leitura */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/30 text-center space-y-4 no-print">
          <h3 className="text-2xl font-extrabold text-foreground">
            Pronto para Automatizar Todo Este Método?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            O ViralBook AI automatiza a mineração de livros, geração de Lean Canvas, mentoria de 8 mentores e criação de Landing Pages.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/Livros_Que_Valem_Milhoes_ViralBook_AI.pdf" download="Livros_Que_Valem_Milhoes_ViralBook_AI.pdf">
              <Button variant="outline" className="font-bold rounded-xl h-12 px-6 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                <Download className="mr-2 h-4 w-4" />
                Descarregar Ficheiro PDF Master (.pdf)
              </Button>
            </a>
            <Link href="/dashboard">
              <Button className="bg-primary text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
                Aceder à Plataforma Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
