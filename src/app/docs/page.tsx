"use client";

import { useState } from "react";
import { 
  Sparkles, Search, ArrowRight, Printer, 
  CheckCircle2, Rocket, Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export default function DocsPage() {
  const { language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handlePrint = () => {
    window.print();
  };

  const isEn = language === "en";
  const isEs = language === "es";

  return (
    <div className="space-y-12 pb-24">
      {/* HEADER PRINCIPAL DO MANUAL */}
      <div className="rounded-3xl bg-gradient-to-br from-card via-card/80 to-primary/5 p-8 md:p-12 border border-border/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl pointer-events-none rounded-full"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> 
              {isEn ? "Official Manual v2.5 — Master Pro Edition" : isEs ? "Manual Oficial v2.5 — Edición Master Pro" : "Manual Oficial v2.5 — Edição Master Pro"}
            </div>
            
            {/* Seletor de Idioma no Header do Manual */}
            <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/50 text-xs font-bold gap-1">
              <button 
                onClick={() => setLanguage('pt', true)} 
                className={`px-2.5 py-1 rounded-lg transition-all ${language === 'pt' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                🇵🇹 PT
              </button>
              <button 
                onClick={() => setLanguage('en', true)} 
                className={`px-2.5 py-1 rounded-lg transition-all ${language === 'en' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                🇺🇸 EN
              </button>
              <button 
                onClick={() => setLanguage('es', true)} 
                className={`px-2.5 py-1 rounded-lg transition-all ${language === 'es' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                🇪🇸 ES
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            {isEn ? "OFFICIAL MANUAL FOR" : isEs ? "MANUAL OFICIAL DE" : "MANUAL OFICIAL DO"} <br />
            <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 bg-clip-text text-transparent">
              VIRALBOOK AI
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {isEn 
              ? "The Definitive Guide to Identifying Opportunities, Validating Software Ideas, Consulting AI Mentors, and Building Successful Startups." 
              : isEs 
              ? "La Guía Definitiva para Identificar Oportunidades, Validar Ideas de Software, Consultar Mentores de IA y Construir Startups de Éxito." 
              : "O Guia Definitivo para Identificar Oportunidades, Validar Ideias de Software, Consultar Mentores de IA e Construir Startups de Sucesso."}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Printer className="mr-2 h-4 w-4" /> {isEn ? "Print / Save PDF" : isEs ? "Imprimir / Guardar PDF" : "Imprimir / Salvar em PDF"}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" className="font-bold rounded-xl h-11 px-6 border-border/50">
                <Rocket className="mr-2 h-4 w-4 text-primary" /> {isEn ? "Go to Platform" : isEs ? "Ir a la Plataforma" : "Ir para a Plataforma"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA E STATUS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={isEn ? "Search by chapter or topic..." : isEs ? "Buscar por capítulo o tema..." : "Pesquisar por capítulo, ferramenta ou dúvida..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 rounded-xl border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
          <span>{isEn ? "12 Complete Chapters" : isEs ? "12 Capítulos Completos" : "12 Capítulos Completos"}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-primary" /> PT / EN / ES</span>
        </div>
      </div>

      {/* PREFÁCIO & INTRODUÇÃO */}
      <section id="prefacio" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-extrabold uppercase">
          {isEn ? "Preface & Introduction" : isEs ? "Prefacio e Introducción" : "Prefácio & Introdução"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "The Era of Reverse Engineering Validated Demands" : isEs ? "La Era de la Ingeniería Inversa de Demandas Validadas" : "A Era da Engenharia Inversa de Demandas Validadas"}
        </h2>
        <p className="text-muted-foreground leading-relaxed text-base">
          {isEn 
            ? "For decades, software entrepreneurship suffered from a chronic issue: founders spent months coding software based on assumptions, only to discover on launch day that nobody wanted to buy it."
            : isEs
            ? "Durante décadas, el emprendimiento de software sufrió un problema crónico: los fundadores pasaban meses programando basándose en suposiciones, solo para descubrir el día del lanzamiento que nadie quería comprarlo."
            : "Durante décadas, o empreendedorismo de tecnologia sofreu com um problema crónico: fundadores gastavam meses codificando softwares baseados no puro achismo para descobrirem, no dia do lançamento, que ninguém queria comprar o produto."}
        </p>
        <p className="text-muted-foreground leading-relaxed text-base">
          {isEn
            ? "ViralBook AI reverses this logic. Instead of inventing an idea from scratch, we map viral books and bestsellers whose pain points are already validated by millions of paying readers, extracting the exact software solution needed."
            : isEs
            ? "ViralBook AI invierte esa lógica. En lugar de inventar una idea desde cero, mapeamos libros virales y bestsellers cuyos problemas ya fueron validados por millones de lectores, extrayendo la solución de software exacta."
            : "O ViralBook AI inverte essa lógica. Em vez de inventar uma ideia do zero, nós mapeamos livros virais e bestsellers cujas dores já foram validadas por milhões de leitores pagantes e extraímos a lacuna exata de software necessária para resolver essa dor no dia a dia."}
        </p>
      </section>

      {/* CAPÍTULO 1 */}
      <section id="capitulo-1" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase">
          {isEn ? "Chapter 1" : isEs ? "Capítulo 1" : "Capítulo 1"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "History, Philosophy, and Methodology of ViralBook AI" : isEs ? "Historia, Filosofía y Metodología de ViralBook AI" : "A História, Filosofia e Metodologia do ViralBook AI"}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          {isEn 
            ? "ViralBook AI was created to solve the bottleneck of modern entrepreneurship: the abundance of coding tools combined with a scarcity of ideas backed by proven market demand."
            : isEs
            ? "ViralBook AI nació para resolver el cuello de botella del emprendimiento moderno: la abundancia de herramientas de código combinada con la escasez de ideas validadas."
            : "O ViralBook AI nasceu para resolver o gargalo do empreendedorismo moderno: a abundância de ferramentas de código aliada à escassez de ideias com demanda comprovada."}
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
            <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2">❌ {isEn ? "Traditional Model (Guesswork)" : isEs ? "Modelo Tradicional (Suposiciones)" : "Modelo Tradicional (Achismo)"}</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• {isEn ? "Ideas based purely on founder intuition" : isEs ? "Ideas basadas puramente en la intuición" : "Ideia nascida da intuição individual do fundador"}</li>
              <li>• {isEn ? "3 to 6 months of coding before testing" : isEs ? "3 a 6 meses de código antes de probar" : "3 a 6 meses de desenvolvimento antes de testar"}</li>
              <li>• {isEn ? "Extremely high Customer Acquisition Cost (CAC)" : isEs ? "Costo de Adquisición (CAC) altísimo" : "Custo de Aquisição (CAC) altíssimo"}</li>
              <li>• {isEn ? "Over 90% failure rate" : isEs ? "Más del 90% de tasa de fracaso" : "Mais de 90% de taxa de mortalidade"}</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <h4 className="font-bold text-emerald-500 mb-2 flex items-center gap-2">🚀 {isEn ? "ViralBook AI Method (Validated Demand)" : isEs ? "Método ViralBook AI (Demanda Validada)" : "Método ViralBook AI (Demanda Validada)"}</h4>
            <ul className="text-sm text-foreground font-medium space-y-2">
              <li>• {isEn ? "Ideas anchored in bestsellers with millions of copies" : isEs ? "Ideas ancladas en bestsellers con millones de copias" : "Ideia ancorada em bestsellers com milhões de cópias"}</li>
              <li>• {isEn ? "Market validation in 24 to 48 hours" : isEs ? "Validación de mercado en 24 a 48 horas" : "Validação de mercado em 24 a 48 horas"}</li>
              <li>• {isEn ? "Qualified audience ready to buy" : isEs ? "Audiencia cualificada y lista para comprar" : "Audiência qualificada e pronta para comprar"}</li>
              <li>• {isEn ? "Drastically reduced risk with blue oceans" : isEs ? "Riesgo reducido drásticamente con océanos azules" : "Risco drasticamente reduzido com oceanos azuis"}</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-muted/50 border border-border/50 space-y-2">
          <h4 className="font-bold text-foreground">📌 {isEn ? "Chapter 1 Summary" : isEs ? "Resumen del Capítulo 1" : "Resumo do Capítulo 1"}</h4>
          <p className="text-sm text-muted-foreground">
            {isEn 
              ? "The 4-step methodology (Discovery, Validation, Advisory, Launch) ensures every project has technical feasibility and irresistible commercial appeal."
              : isEs 
              ? "La metodología de 4 pasos (Descubrimiento, Validación, Mentoría y Lanzamiento) garantiza viabilidad técnica y atractivo comercial."
              : "A metodologia em 4 etapas (Descoberta, Validação, Mentoria e Lançamento) garante que cada projeto tenha viabilidade técnica e apelo comercial irresistível."}
          </p>
        </div>
      </section>

      {/* CAPÍTULO 2 */}
      <section id="capitulo-2" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase">
          {isEn ? "Chapter 2" : isEs ? "Capítulo 2" : "Capítulo 2"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "Platform Architecture and Step-by-Step Navigation" : isEs ? "Arquitectura de la Plataforma y Navegación" : "Arquitetura da Plataforma e Navegação Passo a Passo"}
        </h2>
        
        <p className="text-muted-foreground leading-relaxed">
          {isEn 
            ? "The interface is built in responsive Glassmorphism with support for 5 visual themes (Dark, Light, Tech AI, Cyberpunk, and Retro). The sidebar menu divides the journey into 3 startup maturity phases:"
            : isEs 
            ? "La interfaz está diseñada en Glassmorphism responsivo con soporte para 5 temas visuales (Dark, Light, Tech AI, Cyberpunk y Retro). El menú lateral divide el viaje en 3 fases de madurez:"
            : "A interface foi projetada em Glassmorphism responsivo com suporte a 5 temas visuais (Dark, Light, Tech AI, Cyberpunk e Retro). O menu lateral divide a jornada nas 3 fases de maturidade da startup:"}
        </p>

        <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-bold text-primary text-sm">{isEn ? "Phase 1: Ideation" : isEs ? "Fase 1: Ideación" : "Fase 1: Ideação"}</span>
            <span className="text-xs text-muted-foreground">Library (/library) & Radar (/radar)</span>
          </div>
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-bold text-primary text-sm">{isEn ? "Phase 2: Validation" : isEs ? "Fase 2: Validación" : "Fase 2: Validação"}</span>
            <span className="text-xs text-muted-foreground">Landing Pages (/landing-pages) & Advisors (/advisors)</span>
          </div>
          <div className="flex items-center justify-between pb-1">
            <span className="font-bold text-primary text-sm">{isEn ? "Phase 3: Traction" : isEs ? "Fase 3: Tracción" : "Fase 3: Tração"}</span>
            <span className="text-xs text-muted-foreground">Email Funnel (/email-funnel) & Showcase (/showcase)</span>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 3 */}
      <section id="capitulo-3" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase">
          {isEn ? "Chapter 3" : isEs ? "Capítulo 3" : "Capítulo 3"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "Exhaustive Guide to Features and Buttons" : isEs ? "Guía Detallada de Funcionalidades y Botones" : "Guia Exaustivo de Cada Funcionalidade e Botão"}
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <h4 className="font-bold text-foreground text-base">1. Global Viral Book Radar (`/radar`)</h4>
            <p className="text-xs text-muted-foreground mt-1">{isEn ? "Searches real-time Amazon & Google Books data. Includes the ⚡ Analyze with AI button." : isEs ? "Busca datos en tiempo real de Amazon/Google Books. Incluye el botón ⚡ Analizar con IA." : "Busca dados em tempo real da Amazon/Google Books por palavra-chave ou nicho. Inclui o botão ⚡ Analisar com IA."}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <h4 className="font-bold text-foreground text-base">2. Opportunities Library (`/library`)</h4>
            <p className="text-xs text-muted-foreground mt-1">{isEn ? "AI ideas catalog and generator. Grants direct access to Lean Canvas, Product Simulator, Advisors, and Landing Pages." : isEs ? "Catálogo y generador de ideas con IA. Da acceso a Lean Canvas, Simulador de Producto, Mentores y Landing Page." : "Catálogo e gerador de ideias com IA. Dá acesso direto aos botões de Lean Canvas, Simulador de Produto, Mentores e Landing Page."}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <h4 className="font-bold text-foreground text-base">3. Lean Canvas & Product Simulator (`ProductSimulator`)</h4>
            <p className="text-xs text-muted-foreground mt-1">{isEn ? "Renders UI visual prototype, classifies P0/P1/P2 features, and provides code prompts for Cursor/v0." : isEs ? "Renderiza el prototipo visual de la UI, clasifica funciones P0/P1/P2 y genera prompts para Cursor/v0." : "Renderiza o protótipo visual da UI, classifica funcionalidades em P0/P1/P2 e fornece prompts de código para editores como Cursor/v0."}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
            <h4 className="font-bold text-foreground text-base">4. AI Advisory Board (`/advisors`)</h4>
            <p className="text-xs text-muted-foreground mt-1">{isEn ? "Simulates executive meeting with 8 business legends, calculating the Board Score (0-100) and offering real-time voice chat (TTS)." : isEs ? "Simula una reunión ejecutiva con 8 leyendas de negocios, calcula el Board Score (0-100) y ofrece chat de voz (TTS)." : "Simula a reunião executiva com 8 lendas dos negócios, atribuindo a nota Board Score (0-100) e fornecendo chat em tempo real com voz (TTS)."}</p>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 7 MENTORES */}
      <section id="capitulo-7" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-extrabold uppercase">
          {isEn ? "Chapter 7" : isEs ? "Capítulo 7" : "Capítulo 7"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "The Advisory Board of 8 Business Legends" : isEs ? "El Consejo Consultivo de 8 Leyendas de Negocios" : "O Conselho Consultivo das 8 Lendas dos Negócios"}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Paul Graham</div>
            <div className="text-[10px] text-muted-foreground">Simplicity & PMF</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Steve Jobs</div>
            <div className="text-[10px] text-muted-foreground">UX & Saying No</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Pieter Levels</div>
            <div className="text-[10px] text-muted-foreground">Ship Fast (24h)</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Naval Ravikant</div>
            <div className="text-[10px] text-muted-foreground">Code Leverage</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Elon Musk</div>
            <div className="text-[10px] text-muted-foreground">First Principles</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Sam Altman</div>
            <div className="text-[10px] text-muted-foreground">100x Scale & AI</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Mark Zuckerberg</div>
            <div className="text-[10px] text-muted-foreground">Retention & Virality</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <div className="font-bold text-sm text-foreground">Jeff Bezos</div>
            <div className="text-[10px] text-muted-foreground">Customer Obsession</div>
          </div>
        </div>
      </section>

      {/* CAPÍTULO 12 & ROADMAP */}
      <section id="capitulo-12" className="space-y-6 scroll-mt-24 p-8 rounded-3xl bg-card/40 border border-border/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase">
          {isEn ? "Chapter 12" : isEs ? "Capítulo 12" : "Capítulo 12"}
        </div>
        <h2 className="text-3xl font-extrabold text-foreground">
          {isEn ? "The 30-Day Roadmap & Launch Readiness Checklist" : isEs ? "Roadmap de 30 Días y Lista de Verificación" : "O Roadmap de 30 Dias & Checklist de Prontidão"}
        </h2>

        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <h4 className="font-bold text-foreground mb-2">{isEn ? "30-Item Readiness Checklist Summary:" : isEs ? "Resumen de Lista de Verificación de 30 Puntos:" : "Checklist de Prontidão (30 Itens Resumidos):"}</h4>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "Viral book selected on Radar" : isEs ? "Libro viral seleccionado en el Radar" : "Livro viral selecionado no Radar"}</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "Board Score > 75/100" : isEs ? "Board Score > 75/100" : "Board Score dos Mentores > 75/100"}</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "Landing Page generated & live" : isEs ? "Landing Page generada y publicada" : "Landing Page gerada e publicada"}</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "50 waitlist subscribers" : isEs ? "50 inscritos en lista de espera" : "Lista de espera com 50 inscritos"}</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "Code prompts copied to Cursor/v0" : isEs ? "Prompts de código copiados a Cursor/v0" : "Prompts copiados para o Cursor/v0"}</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {isEn ? "Project submitted to Showcase" : isEs ? "Proyecto publicado en el Showcase" : "Projeto publicado no Showcase"}</div>
          </div>
        </div>

        <div className="pt-6 border-t border-border/40 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-foreground">
            {isEn ? "Ready to Build Your Next Startup?" : isEs ? "¿Listo para Construir tu Próxima Startup?" : "Pronto para Construir sua Próxima Startup?"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {isEn 
              ? "Access the Global Radar now and take the first step towards turning a viral bestseller into a profitable digital business."
              : isEs 
              ? "Accede al Radar Global ahora y da el primer paso para convertir un bestseller viral en un negocio digital rentable."
              : "Acesse o Radar Global agora mesmo e dê o primeiro passo para transformar um bestseller viral num negócio digital lucrativo."}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/radar">
              <Button className="bg-primary text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20">
                {isEn ? "Access Book Radar" : isEs ? "Acceder al Radar" : "Acessar o Radar de Livros"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
