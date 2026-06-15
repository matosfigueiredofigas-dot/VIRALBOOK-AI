import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { WaitlistForm } from "@/components/waitlist-form";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

function DynamicIcon({ name, className, color }: { name: string; className?: string; color?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Sparkles;
  return <IconComponent className={className} style={{ color }} />;
}

// Para SEO dinâmico
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: lp } = await supabase
    .from('landing_pages')
    .select('headline, subheadline, opportunities(saas_name)')
    .eq('slug', params.slug)
    .single();

  if (!lp) {
    return {
      title: 'Página não encontrada',
    };
  }

  const name = lp.opportunities?.saas_name || 'SaaS';
  return {
    title: `${name} | ${lp.headline}`,
    description: lp.subheadline,
  };
}

export default async function PublicLandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient();

  // 1. Carregar a Landing Page com os dados do SaaS associado
  const { data: lp, error } = await supabase
    .from('landing_pages')
    .select('*, opportunities(*)')
    .eq('slug', params.slug)
    .single();

  if (error || !lp) {
    notFound();
  }

  const saasName = lp.opportunities?.saas_name || "SaaS App";
  const themeColor = lp.theme_color || "#a855f7";

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 selection:bg-purple-500/30 selection:text-white relative overflow-hidden font-sans pb-12">
      {/* Background Glows (Premium Ambient Lighting) */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none opacity-30 blur-[130px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute top-[25%] left-1/4 w-[500px] h-[500px] pointer-events-none opacity-10 blur-[150px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${themeColor} 0%, transparent 80%)`
        }}
      />
      <div className="absolute top-[800px] right-[-10%] w-[600px] h-[600px] pointer-events-none opacity-10 blur-[180px] rounded-full bg-blue-500/40" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] pointer-events-none opacity-[0.08] blur-[180px] rounded-full bg-purple-500/40" />

      {/* Grid Pattern overlay for premium tech look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}bb 100%)`,
              boxShadow: `0 4px 15px -3px ${themeColor}80`
            }}
          >
            <Icons.Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            {saasName}
          </span>
        </div>
        <Badge variant="outline" className="border-zinc-800 text-zinc-300 bg-zinc-900/50 px-3.5 py-1.5 backdrop-blur-md rounded-full shadow-inner flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Fase Alpha Limitada 🚀
        </Badge>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center relative z-10 space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md text-xs font-semibold text-zinc-300 shadow-md">
          <Icons.Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: themeColor }} />
          <span>Oportunidade Exclusiva & Convites para Fundadores</span>
        </div>

        <h1 className="text-4xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] text-white max-w-4xl mx-auto font-sans">
          <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {lp.headline}
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
          {lp.subheadline}
        </p>

        {/* Form para Lista de Espera */}
        <div className="pt-6">
          <div className="p-1 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 max-w-lg mx-auto backdrop-blur-xl shadow-2xl shadow-black/80">
            <div className="p-6">
              <WaitlistForm 
                landingPageId={lp.id} 
                ctaText={lp.cta_text} 
                themeColor={themeColor} 
              />
              <p className="text-xxs text-zinc-500 mt-4 flex items-center justify-center gap-1.5">
                <Icons.Lock className="h-3.5 w-3.5 text-zinc-600" />
                Inscrição segura. Você receberá o convite do beta no e-mail cadastrado.
              </p>
            </div>
          </div>
        </div>

        {/* Featured On (Trust Badges) */}
        <div className="pt-12 space-y-4">
          <p className="text-xxs font-bold uppercase tracking-widest text-zinc-600">Projetado com base em ideias virais e validado no mercado</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-40 grayscale contrast-120">
            <span className="text-sm font-black text-white tracking-widest">PRODUCT HUNT</span>
            <span className="text-sm font-bold text-white tracking-widest">HACKER NEWS</span>
            <span className="text-sm font-semibold text-white tracking-widest">INDIE HACKERS</span>
            <span className="text-sm font-extrabold text-white tracking-widest">REDDIT</span>
          </div>
        </div>
      </section>

      {/* Benefícios Principais (Glow Cards) */}
      {lp.benefits && lp.benefits.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              O que torna o {saasName} único?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Menos teoria, mais resultados práticos. Desenvolvido para resolver o problema na raiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lp.benefits.map((benefit: any, index: number) => (
              <div 
                key={index} 
                className="p-8 rounded-[24px] border border-white/[0.03] bg-zinc-900/[0.15] backdrop-blur-xl relative group hover:border-white/[0.08] hover:bg-zinc-900/[0.25] transition-all duration-500 shadow-xl"
              >
                {/* Glow Effect on Hover */}
                <div 
                  className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${themeColor}12 0%, transparent 60%)`,
                    border: `1px solid ${themeColor}20`
                  }}
                />
                
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs mb-6 bg-zinc-900 border border-zinc-800"
                  style={{ color: themeColor }}
                >
                  0{index + 1}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">{benefit.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid (Highlight Cards) */}
      {lp.features && lp.features.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Funcionalidades Essenciais
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Construído de forma enxuta para entregar valor imediato desde a primeira inicialização.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {lp.features.map((feature: any, index: number) => (
              <div 
                key={index} 
                className="p-8 rounded-[24px] border border-white/[0.04] bg-zinc-900/[0.2] backdrop-blur-md relative group hover:border-white/[0.08] hover:bg-zinc-900/[0.35] transition-all duration-500 flex flex-col justify-between h-full shadow-2xl"
              >
                <div>
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-8 bg-zinc-950 border border-zinc-900 group-hover:scale-110 transition-transform duration-300 shadow-inner"
                  >
                    <DynamicIcon name={feature.icon} className="h-6 w-6" color={themeColor} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials (Premium Quote Blocks) */}
      {lp.testimonials && lp.testimonials.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              O que dizem os primeiros usuários
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Validado por pessoas reais que enfrentavam o mesmo problema todos os dias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lp.testimonials.map((test: any, index: number) => (
              <div 
                key={index} 
                className="p-8 rounded-[24px] border border-white/[0.03] bg-zinc-900/[0.1] backdrop-blur-sm flex flex-col justify-between space-y-8 relative overflow-hidden group hover:border-white/[0.08] transition-all duration-300"
              >
                <Icons.Quote className="absolute top-6 right-6 h-12 w-12 text-zinc-800/15 pointer-events-none" />
                
                <p className="text-zinc-300 italic text-base leading-relaxed relative z-10 font-light">
                  &ldquo;{test.quote}&rdquo;
                </p>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="h-11 w-11 rounded-full border flex items-center justify-center font-bold text-sm text-white"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}55 100%)`,
                      borderColor: `${themeColor}40`
                    }}
                  >
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{test.name}</h4>
                    <p className="text-xs text-zinc-500 font-semibold">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {lp.faqs && lp.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-24 border-t border-zinc-900/60 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Tudo o que você precisa saber sobre o {saasName} e a lista de espera.
            </p>
          </div>

          <div className="space-y-4">
            {lp.faqs.map((faq: any, index: number) => (
              <details 
                key={index} 
                className="group border border-white/[0.03] bg-zinc-900/[0.1] backdrop-blur-sm rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-white/[0.08] transition-all"
              >
                <summary className="flex items-center justify-between focus:outline-none">
                  <span className="font-bold text-base sm:text-lg text-zinc-200 group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                  <span className="ml-1.5 shrink-0 rounded-full bg-zinc-950 p-2 text-zinc-400 group-open:rotate-180 transition-transform duration-300 border border-zinc-900">
                    <Icons.ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400 border-t border-zinc-900/50 pt-4 cursor-default font-light">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-zinc-900/60 text-center relative z-10 space-y-8">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Garanta seu acesso antecipado
        </h2>
        <p className="text-sm sm:text-lg text-zinc-400 max-w-xl mx-auto font-light">
          Entre na lista de fundadores hoje e receba uma oferta exclusiva de lançamento e prioridade no beta test.
        </p>
        <div className="pt-4">
          <div className="p-1 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 max-w-lg mx-auto backdrop-blur-xl shadow-2xl shadow-black/80">
            <div className="p-6">
              <WaitlistForm 
                landingPageId={lp.id} 
                ctaText={lp.cta_text} 
                themeColor={themeColor} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 pt-16 pb-8 border-t border-zinc-900/30 text-center relative z-10 text-xs text-zinc-600 space-y-3">
        <p>&copy; {new Date().getFullYear()} {saasName}. Todos os direitos reservados.</p>
        <p className="flex items-center justify-center gap-1.5 font-semibold">
          Criado com 
          <a href="/" className="text-zinc-500 hover:text-white transition-colors font-black flex items-center gap-1">
            <Icons.TrendingUp className="h-4 w-4" /> ViralBook AI
          </a>
        </p>
      </footer>
    </div>
  );
}
