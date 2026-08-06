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
                Edição Master Cinematográfica · 4.600+ Palavras · Guia Oficial 2025
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15] print:text-3xl print:text-black">
                LIVROS QUE VALEM MILHÕES <br />
                <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent print:text-black print:bg-none">
                  O Manifesto para Extrair Softwares de Bestsellers
                </span>
              </h1>

              <p className="text-sm font-semibold text-muted-foreground print:text-black">
                Por ViralBook AI · Edição Digital Exclusiva (2025)
              </p>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4 py-1 print:text-black print:border-black">
                "Não construas na escuridão da tua mente. Olha para a tela da realidade: a dor já foi escrita, o público já pagou, e a cena está pronta para a tua entrada."
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

            {/* Imagem de Capa Cinematográfica 3D */}
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

        {/* ACTO I */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Acto I</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Paradoxo da Tela em Branco</h2>
          
          <h3 className="text-lg font-bold text-foreground print:text-black mt-4">Cena 1: A Ilusão da Criação</h3>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Corta para a meia-noite. Uma sala escura. A única luz vem de um monitor de 27 polegadas que projeta um brilho azul no rosto de um programador. As suas mãos voam pelo teclado mecânico. Na tela, linhas de código TypeScript ganham vida numa harmonia perfeita.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Durante três meses, este foi o seu ritual. Dias sem dormir, fins de semana sacrificados. Ele construiu uma catedral tecnológica: painel com gráficos, autenticação biométrica e base de dados impecável. Chega o momento do lançamento: ele clica em "Publicar". Espera. Uma hora. Duas horas. Seis horas. <strong>Nenhum registo. Nenhuma venda. Apenas um silêncio ensurdecedor.</strong>
          </p>
          
          <h3 className="text-lg font-bold text-foreground print:text-black mt-4">Cena 2: A Revolução das Ferramentas vs A Escassez da Verdade</h3>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Nunca foi tão rápido construir software. O código deixou de ser a fortaleza inacessível. Com editores neurais como Cursor e motores de IA, qualquer pessoa consegue ter um MVP funcional em 24 a 72 horas.
          </p>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1 print:border-black">
            <code className="text-xs font-bold text-primary block print:text-black">
              FACILIDADE DE CÓDIGO ──&gt; EXCESSO DE PRODUTOS ──&gt; ESCASSEZ DE ATENÇÃO
            </code>
          </div>

          <h3 className="text-lg font-bold text-foreground print:text-black mt-4">Cena 3: A Inversão da Lógica</h3>
          <p className="text-muted-foreground leading-relaxed text-sm print:text-black">
            Enquanto os fundadores passam meses a adivinhar o que o mercado quer, os consumidores de todo o planeta já estão a declarar as suas maiores dores não resolvidas — através de <strong>livros bestsellers</strong>. Quando um leitor paga por um livro de não-ficção, ele está a votar com o seu próprio dinheiro num problema real.
          </p>
        </article>

        {/* ACTO II */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Acto II</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">As 7 Pistas Ocultas nas Prateleiras</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 1: O Ciclo Infinito (Processos Repetitivos)</h4>
              <p className="text-xs text-muted-foreground print:text-black">Métodos que exigem rotinas diárias/semanais geram fadiga manual no papel. O software automatiza e lembra no segundo exato.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 2: O Mapa de Papel (Tabelas e Checklists)</h4>
              <p className="text-xs text-muted-foreground print:text-black">Cada tabela ou matriz desenhada num livro é uma Interface de Utilizador (UI) disfarçada a clamar por código.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 3: A Ferida Crónica (Dor Recorrente = SaaS)</h4>
              <p className="text-xs text-muted-foreground print:text-black">Dores crónicas (como finanças ou ansiedade de tempo) criam subscrições recorrentes de baixo churn.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 4: As Tribos Famintas (Reddit & Fóruns)</h4>
              <p className="text-xs text-muted-foreground print:text-black">Subreddits onde milhares de leitores partilham planilhas manuais e perguntam por apps automáticas.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 5: O Grito nos Reviews de 3 Estrelas</h4>
              <p className="text-xs text-muted-foreground print:text-black">Leitores apaixonados pelo conceito que reclamam da falta de ferramentas práticas. Briefing de produto gratuito!</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/40 border border-border/40 space-y-1 print:border-black">
              <h4 className="font-bold text-foreground text-sm print:text-black">Pista 6: Os Territórios de Ouro</h4>
              <p className="text-xs text-muted-foreground print:text-black">Produtividade, Negócios & Vendas, Finanças Pessoais, Saúde & Biohacking.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1 print:border-black">
            <h4 className="font-bold text-foreground text-sm print:text-black">Pista 7: O Trono Vazio (Autor sem Software Próprio)</h4>
            <p className="text-xs text-muted-foreground print:text-black">Se o bestseller vendeu 500k cópias e o autor não tem software, a porta está totalmente aberta para si.</p>
          </div>
        </article>

        {/* ACTO III */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-6 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Acto III</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">O Protocolo de 48 Horas: Da Prateleira ao SaaS</h2>
          
          <div className="space-y-4 text-sm text-muted-foreground print:text-black">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Fase 1: Mineração de Bestsellers no ViralBook AI</h3>
              <p>Aceda a 🔗 <strong>viralbook-ai.vercel.app/radar</strong>. Digite o nome de um livro ou nicho (ex: <em>Atomic Habits</em>) e clique nos <strong>🎯 Filtros de Mineração (Livro)</strong>. A IA calcula o Score e analisa a oportunidade.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Fase 2: Radiografia de Dores & Reviews de 3★</h3>
              <p>Abra o modal de <strong>🔍 Radiografia de Dores</strong> no Radar para extrair as queixas principais dos leitores de 3 estrelas e os destaques do Kindle.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Fase 3: MVP com Regra P0 (Funcionalidade Única)</h3>
              <p>Construa apenas a funcionalidade sem a qual o produto perde o sentido (P0). Deixe relatórios e definições para a v2.0.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <h3 className="font-bold text-foreground text-base mb-1 print:text-black">Fase 4: Validação em 48 Horas</h3>
              <p>Publique uma Landing Page de lista de espera gerada pela IA. Se alcançar +50 inscrições em 48h, avance com confiança!</p>
            </div>
          </div>
        </article>

        {/* ACTO IV */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Acto IV</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">Histórias de Sucesso Blockbuster</h2>
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

        {/* ACTO V & VI */}
        <article className="p-8 rounded-3xl bg-card/50 border border-border/50 space-y-4 print:border-none print-break-before">
          <span className="text-xs font-extrabold text-primary uppercase tracking-wider print:text-black">Acto V & VI</span>
          <h2 className="text-2xl font-black text-foreground print:text-black">Os 3 Erros Fatais & O Roteiro das 48 Horas</h2>
          <div className="space-y-3 text-sm text-muted-foreground print:text-black">
            <p><strong>Erro 1 (O Código Cego):</strong> Programar durante meses antes de vender. Valide primeiro!</p>
            <p><strong>Erro 2 (O Monstro das 100 Funcionalidades):</strong> Tentar colocar o livro inteiro numa só versão.</p>
            <p><strong>Erro 3 (O Silêncio da Torre de Marfim):</strong> Desenvolver sem ouvir os subreddits e fóruns do livro.</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 print:border-black">
            <h4 className="font-bold text-emerald-400 text-sm print:text-black">Roteiro de Execução de Fim de Semana:</h4>
            <p className="text-xs text-muted-foreground print:text-black">
              Sábado de Manhã (Radar & Filtros) → Sábado à Tarde (Radiografia de Dores) → Sábado à Noite (Landing Page) → Domingo (Divulgação & 50 Leads).
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
