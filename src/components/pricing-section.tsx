"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Lock, Zap, Crown, Star, ArrowRight, Infinity } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// ─────────────────────────────────────────────────────────────────────────────
// Dual Payment Processor Strategy:
//   🇧🇷 BRL  → Hotmart   (melhor conversão no Brasil: Pix, boleto, afiliados)
//   🇺🇸 USD  → LemonSqueezy (global: cartão internacional, Apple Pay)
//   🇪🇺 EUR  → LemonSqueezy (Europa)
// ─────────────────────────────────────────────────────────────────────────────
const CHECKOUT_URLS = {
  basic: {
    monthly: {
      // LemonSqueezy — USD & EUR
      USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_USD_URL    || "https://viralbook.lemonsqueezy.com/checkout/buy/basic-usd",
      EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_EUR_URL    || "https://viralbook.lemonsqueezy.com/checkout/buy/basic-eur",
      // Hotmart — BRL
      BRL: process.env.NEXT_PUBLIC_HOTMART_BASIC_BRL_URL          || "https://pay.hotmart.com/BASIC_BRL_ID",
    },
    annual: {
      USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_ANNUAL_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/basic-annual-usd",
      EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_BASIC_ANNUAL_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/basic-annual-eur",
      BRL: process.env.NEXT_PUBLIC_HOTMART_BASIC_ANNUAL_BRL_URL       || "https://pay.hotmart.com/BASIC_ANNUAL_BRL_ID",
    },
  },
  pro: {
    monthly: {
      USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_USD_URL     || "https://viralbook.lemonsqueezy.com/checkout/buy/pro-usd",
      EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_EUR_URL     || "https://viralbook.lemonsqueezy.com/checkout/buy/pro-eur",
      BRL: process.env.NEXT_PUBLIC_HOTMART_PRO_BRL_URL           || "https://pay.hotmart.com/PRO_BRL_ID",
    },
    annual: {
      USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_ANNUAL_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/pro-annual-usd",
      EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_ANNUAL_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/pro-annual-eur",
      BRL: process.env.NEXT_PUBLIC_HOTMART_PRO_ANNUAL_BRL_URL        || "https://pay.hotmart.com/PRO_ANNUAL_BRL_ID",
    },
  },
  lifetime: {
    USD: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_USD_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/lifetime-usd",
    EUR: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_LIFETIME_EUR_URL || "https://viralbook.lemonsqueezy.com/checkout/buy/lifetime-eur",
    BRL: process.env.NEXT_PUBLIC_HOTMART_LIFETIME_BRL_URL       || "https://pay.hotmart.com/LIFETIME_BRL_ID",
  },
};

type Currency = 'USD' | 'BRL' | 'EUR';
type Billing = 'monthly' | 'annual';

const PRICES = {
  basic: {
    monthly:  { USD: '$9',    BRL: 'R$ 47',  EUR: '9 €',   originalUSD: '$29',   originalBRL: 'R$ 147', originalEUR: '29 €'  },
    annual:   { USD: '$86',   BRL: 'R$ 451', EUR: '86 €',  originalUSD: '$108',  originalBRL: 'R$ 564', originalEUR: '108 €' },
    perMonth: { USD: '$7.2',  BRL: 'R$ 37',  EUR: '7.2 €' },
  },
  pro: {
    monthly:  { USD: '$19',   BRL: 'R$ 97',  EUR: '19 €',  originalUSD: '$69',   originalBRL: 'R$ 397', originalEUR: '69 €'  },
    annual:   { USD: '$182',  BRL: 'R$ 931', EUR: '182 €', originalUSD: '$228',  originalBRL: 'R$ 1164', originalEUR: '228 €' },
    perMonth: { USD: '$15.2', BRL: 'R$ 77',  EUR: '15.2 €' },
  },
  lifetime: {
    USD: '$147', BRL: 'R$ 597', EUR: '147 €',
    originalUSD: '$497', originalBRL: 'R$ 1997', originalEUR: '497 €',
  }
};

const LIFETIME_SPOTS_TOTAL = 50;
const LIFETIME_SPOTS_TAKEN = 31; // spots já vendidos (atualizar manualmente)

export function PricingSection() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [currency, setCurrency] = useState<Currency>('USD');
  const [billing, setBilling] = useState<Billing>('monthly');
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

  const spotsLeft = LIFETIME_SPOTS_TOTAL - LIFETIME_SPOTS_TAKEN;
  const spotsPercent = (LIFETIME_SPOTS_TAKEN / LIFETIME_SPOTS_TOTAL) * 100;

  const getCheckoutUrl = (tier: 'basic' | 'pro') => {
    return CHECKOUT_URLS[tier][billing][currency];
  };

  const getLifetimeUrl = () => CHECKOUT_URLS.lifetime[currency];

  // Identifica qual processador está ativo para a moeda selecionada
  const activeProcessor = currency === 'BRL' ? 'Hotmart' : 'LemonSqueezy';
  const processorColor  = currency === 'BRL' ? 'text-orange-500' : 'text-blue-500';

  const basicFeatures = [
    { active: true,  text: isEn ? 'Ebooks Radar & Signals Access' : isEs ? 'Acceso al Radar de Ebooks y Señales' : 'Acesso ao Radar de Ebooks & Sinais' },
    { active: true,  text: isEn ? '50 manual searches / month' : isEs ? '50 búsquedas manuales / mes' : '50 pesquisas manuais / mês' },
    { active: true,  text: isEn ? 'Global Trends view' : isEs ? 'Vista de Tendencias Globales' : 'Vista de Tendências Globais' },
    { active: true,  text: isEn ? 'Public Ideas Library access' : isEs ? 'Acceso a la Biblioteca de Ideas' : 'Acesso à Biblioteca de Ideias' },
    { active: false, text: isEn ? 'Lean Canvas & AI Blueprints' : isEs ? 'Lean Canvas & Planos de IA' : 'Lean Canvas & Blueprints com IA' },
    { active: false, text: isEn ? 'AI CTO & 8 Mentors Board' : isEs ? 'CTO IA & 8 Mentores' : 'CTO IA & 8 Mentores' },
  ];

  const proFeatures = [
    isEn ? 'Everything in Basic — UNLIMITED searches' : isEs ? 'Todo en Basic — búsquedas ILIMITADAS' : 'Tudo do Basic + pesquisas ILIMITADAS',
    isEn ? 'Unlimited Lean Canvas & AI Blueprints' : isEs ? 'Lean Canvas & Planos IA Ilimitados' : 'Lean Canvas & Blueprints ilimitados',
    isEn ? 'Full AI CTO + 8 Legendary Mentors Board' : isEs ? 'CTO IA + Consejo de 8 Mentores Legendarios' : 'CTO IA + Conselho dos 8 Mentores Lendários',
    isEn ? 'Landing Pages & Email Funnel AI Generator' : isEs ? 'Generador IA de Landing Pages & Funnels' : 'Gerador IA de Landing Pages & Funil de Email',
    isEn ? 'Priority support + Early feature access' : isEs ? 'Soporte prioritario + Acceso anticipado' : 'Suporte prioritário + Acesso antecipado',
  ];

  return (
    <section id="pricing" className="w-full py-24 md:py-32 px-4 md:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">

        {/* Título */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {t.landing.pricingTitle}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.landing.pricingSubtitle}
          </p>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ TOGGLE MENSAL / ANUAL ━━━━━━━━━━━━━━━━━━ */}
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex p-1 bg-muted/60 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                billing === 'monthly'
                  ? 'bg-background text-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isEn ? 'Monthly' : isEs ? 'Mensual' : 'Mensal'}
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isEn ? 'Annual' : isEs ? 'Anual' : 'Anual'}
              <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase">
                {isEn ? 'Save 20%' : isEs ? '-20%' : '-20%'}
              </span>
            </button>
          </div>
          {billing === 'annual' && (
            <p className="text-xs text-emerald-500 font-semibold animate-pulse">
              💰 {isEn ? 'Annual billing — receive 2 months free!' : isEs ? 'Facturación anual — ¡2 meses gratis!' : 'Faturação anual — ganhe 2 meses grátis!'}
            </p>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ SELETOR DE MOEDA ━━━━━━━━━━━━━━━━━━ */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex p-1 bg-muted/50 backdrop-blur-md rounded-full border border-border/50 shadow-lg">
            {(['USD', 'BRL', 'EUR'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  currency === c
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c === 'USD' ? '🇺🇸 USD ($)' : c === 'BRL' ? '🇧🇷 BRL (R$)' : '🇪🇺 EUR (€)'}
              </button>
            ))}
          </div>
          {/* Badge a mostrar qual processador está ativo */}
          <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${processorColor}`}>
            {currency === 'BRL'
              ? '🔥 Checkout via Hotmart — Pix & Boleto disponíveis'
              : '🔒 Checkout via LemonSqueezy — Cartão internacional'
            }
          </p>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ CARDS BÁSICO + PRO ━━━━━━━━━━━━━━━━━━ */}
        <div className="max-w-4xl mx-auto text-left grid md:grid-cols-2 gap-8 items-stretch">

          {/* Card Básico */}
          <div className="rounded-[32px] bg-card border border-border/50 relative flex flex-col shadow-lg transition-transform hover:-translate-y-1">
            <div className="p-8 md:p-10 flex flex-col justify-between h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{t.landing.basicPlanTitle}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isEn ? 'Basic Access' : isEs ? 'Acceso Básico' : 'Acesso Básico'}
                  </p>
                </div>

                <div className="py-4 border-y border-border/40">
                  <span className="text-muted-foreground line-through text-sm font-medium block">
                    {billing === 'monthly'
                      ? PRICES.basic.monthly[`original${currency}` as keyof typeof PRICES.basic.monthly]
                      : PRICES.basic.annual[`original${currency}` as keyof typeof PRICES.basic.annual]
                    }
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-foreground tracking-tight">
                      {billing === 'monthly'
                        ? PRICES.basic.monthly[currency]
                        : PRICES.basic.annual[currency]
                      }
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {billing === 'monthly'
                        ? (isEn ? '/month' : isEs ? '/mes' : '/mês')
                        : (isEn ? '/year' : isEs ? '/año' : '/ano')
                      }
                    </span>
                  </div>
                  {billing === 'annual' && (
                    <p className="text-xs text-emerald-500 font-semibold mt-1">
                      ≈ {PRICES.basic.perMonth[currency]}{isEn ? '/month' : isEs ? '/mes' : '/mês'}
                    </p>
                  )}
                </div>

                <ul className="space-y-4">
                  {basicFeatures.map((item, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm font-medium ${item.active ? 'text-muted-foreground' : 'text-muted-foreground/45 line-through'}`}>
                      {item.active ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 opacity-70" />
                      ) : (
                        <span className="text-muted-foreground/35 font-extrabold text-lg leading-none shrink-0 w-5 text-center">×</span>
                      )}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 pt-6 border-t border-border/50">
                <a
                  href={getCheckoutUrl('basic')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center bg-muted text-foreground hover:bg-muted/80 w-full h-12 text-sm font-bold rounded-xl border border-border/50 transition-colors"
                >
                  {t.landing.buyNow}
                </a>
              </div>
            </div>
          </div>

          {/* Card Pro Master */}
          <div className="p-[2px] rounded-[32px] bg-gradient-to-b from-primary via-primary/50 to-purple-600/30 relative group flex flex-col shadow-2xl scale-105 z-10">
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-[32px] -z-10 group-hover:bg-primary/25 transition-all duration-700"/>
            {/* Badge Recomendado */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500 text-primary-foreground text-xs font-extrabold shadow-lg shadow-primary/30 uppercase tracking-wider">
                <Star className="h-3.5 w-3.5 fill-current" />
                {isEn ? 'Most Popular' : isEs ? 'Más Popular' : 'Mais Popular'}
              </span>
            </div>

            <div className="bg-card/95 backdrop-blur-xl rounded-[30px] p-8 md:p-10 flex flex-col justify-between h-full border border-border/50 pt-10">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {t.landing.proPlanTitle} <Crown className="h-5 w-5 text-yellow-500" />
                    </h3>
                    <p className="text-sm text-primary mt-1 font-semibold">
                      {isEn ? 'Recommended — Full Access' : isEs ? 'Recomendado — Acceso Total' : 'Recomendado — Acesso Total'}
                    </p>
                  </div>
                </div>

                <div className="py-4 border-y border-border/40">
                  <span className="text-muted-foreground line-through text-sm font-medium block">
                    {billing === 'monthly'
                      ? PRICES.pro.monthly[`original${currency}` as keyof typeof PRICES.pro.monthly]
                      : PRICES.pro.annual[`original${currency}` as keyof typeof PRICES.pro.annual]
                    }
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-5xl font-extrabold text-foreground tracking-tight">
                      {billing === 'monthly'
                        ? PRICES.pro.monthly[currency]
                        : PRICES.pro.annual[currency]
                      }
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      {billing === 'monthly'
                        ? (isEn ? '/month' : isEs ? '/mes' : '/mês')
                        : (isEn ? '/year' : isEs ? '/año' : '/ano')
                      }
                    </span>
                  </div>
                  {billing === 'annual' && (
                    <p className="text-xs text-emerald-500 font-semibold mt-1">
                      ≈ {PRICES.pro.perMonth[currency]}{isEn ? '/month' : isEs ? '/mes' : '/mês'} —{' '}
                      <span className="text-emerald-400">{isEn ? '2 months FREE' : isEs ? '2 meses GRATIS' : '2 meses GRÁTIS'}</span>
                    </p>
                  )}
                </div>

                <ul className="space-y-4">
                  {proFeatures.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span className={i === 0 ? "text-foreground font-bold" : ""}>{item}</span>
                    </li>
                  ))}
                  {/* Countdown */}
                  <li className="flex items-center gap-3 text-sm font-bold text-red-500">
                    <Clock className="h-5 w-5 animate-pulse shrink-0" />
                    <span>{t.landing.limitedTimeOffer} {formatTime(timeLeft)}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-10 pt-6 border-t border-border/50 space-y-3">
                <a
                  href={getCheckoutUrl('pro')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/85 w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  {t.landing.buyNow} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ LIFETIME DEAL BANNER ━━━━━━━━━━━━━━━━━━ */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-amber-500/5 to-orange-500/5 p-8 md:p-10">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="text-left space-y-3 flex-1">
                {/* Badge LTD */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/25 text-xs font-extrabold uppercase tracking-wider">
                  <Infinity className="h-3.5 w-3.5" />
                  {isEn ? 'Lifetime Deal — Limited Launch Offer' : isEs ? 'Oferta Vitalicia — Lanzamiento Limitado' : 'Lifetime Deal — Oferta de Lançamento Limitada'}
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {isEn ? 'Pay Once, Use Forever.' : isEs ? 'Paga Una Vez, Úsalo para Siempre.' : 'Pague Uma Vez, Use Para Sempre.'}
                </h3>

                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                  {isEn
                    ? 'A one-time payment for lifetime access to all Pro features — past, present, and future. No monthly fees, ever. Only for the first 50 founding members.'
                    : isEs
                    ? 'Un pago único por acceso vitalicio a todas las funciones Pro — pasadas, presentes y futuras. Sin cuotas mensuales. Solo para los primeros 50 miembros fundadores.'
                    : 'Um pagamento único por acesso vitalício a todas as funcionalidades Pro — passadas, presentes e futuras. Sem mensalidades para sempre. Apenas para os primeiros 50 membros fundadores.'
                  }
                </p>

                {/* Barra de Progresso de Vagas */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">
                      {isEn ? `${LIFETIME_SPOTS_TAKEN} of ${LIFETIME_SPOTS_TOTAL} spots taken` : isEs ? `${LIFETIME_SPOTS_TAKEN} de ${LIFETIME_SPOTS_TOTAL} lugares ocupados` : `${LIFETIME_SPOTS_TAKEN} de ${LIFETIME_SPOTS_TOTAL} vagas ocupadas`}
                    </span>
                    <span className="text-red-500 font-extrabold animate-pulse">
                      {isEn ? `⚠️ Only ${spotsLeft} left!` : isEs ? `⚠️ ¡Solo ${spotsLeft} restantes!` : `⚠️ Apenas ${spotsLeft} restantes!`}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${spotsPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Preço e CTA do LTD */}
              <div className="flex flex-col items-center gap-4 shrink-0 min-w-[200px]">
                <div className="text-center">
                  <span className="text-muted-foreground line-through text-sm font-medium block">
                    {PRICES.lifetime[`original${currency}` as keyof typeof PRICES.lifetime]}
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-5xl font-extrabold text-foreground tracking-tight">
                      {PRICES.lifetime[currency]}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 font-bold mt-1">
                    {isEn ? 'One-time payment' : isEs ? 'Pago único' : 'Pagamento único'}
                  </p>
                </div>
                <a
                  href={getLifetimeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-extrabold shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  {isEn ? 'Claim My Spot' : isEs ? 'Reservar mi Lugar' : 'Garantir Minha Vaga'}
                </a>
                <p className="text-[10px] text-muted-foreground text-center">
                  {isEn ? '30-day money-back guarantee' : isEs ? 'Garantía de devolución 30 días' : 'Garantia de reembolso 30 dias'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SSL + Processadores */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
            <Lock className="h-4 w-4" />
            <span>SSL Encryption · {isEn ? '30-day guarantee' : isEs ? 'Garantía 30 días' : 'Garantia 30 dias'}</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-medium">
            🇧🇷 BRL via <span className="text-orange-500 font-bold">Hotmart</span>
            {' · '}
            🌍 USD/EUR via <span className="text-blue-500 font-bold">LemonSqueezy</span>
          </p>
        </div>
      </div>
    </section>
  );
}
