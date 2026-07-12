# ViralBook AI 🚀

> **Plataforma de inteligência de mercado para desenvolvedores e empreendedores** — encontre, valide e estruture ideias de produtos digitais com IA antes de escrever uma linha de código.

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-AI-orange)](https://groq.com)

---

## 📖 Sobre o Projeto

O **ViralBook AI** varre o mercado digital em tempo real (Reddit, Facebook, ebooks, tendências globais) e usa IA para identificar dores reais de um público, cruzar padrões de consumo e gerar planos de negócio estruturados (Lean Canvas) prontos para execução — em segundos.

**Ideal para:**
- 🧑‍💻 Developers que querem construir o produto certo na primeira tentativa
- 🚀 Indie Hackers validando novos nichos de mercado
- 📊 Empreendedores buscando oportunidades de baixo risco

---

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| **Radar de Nichos** | Pesquisa ativa de oportunidades por nicho com IA (Groq) |
| **Biblioteca de Ideias** | Cofre de ideias geradas e salvas pelo utilizador |
| **Lean Canvas IA** | Geração automática de plano de negócios completo |
| **CTO IA (Chat)** | Assistente técnico para arquitetura e stack do produto |
| **Conselho de Mentores** | Painel de mentores IA especializados por área |
| **Teardown de Produtos** | Análise reversa de produtos concorrentes |
| **Email Funnel IA** | Gerador de sequências de e-mails de vendas |
| **Landing Pages IA** | Criador de landing pages de conversão |
| **Trend Ticker** | Ticker ao vivo de tendências globais de mercado |
| **Favoritos** | Salva e organiza as melhores oportunidades |
| **Exportação CSV** | Exporta relatórios de oportunidades |
| **Partilha Pública** | Partilha oportunidades com URL público |

---

## 💰 Planos e Preços (Lifetime Deals)

| Plano | Preço BRL | Preço USD | Acesso |
|---|---|---|---|
| **Basic** | R$ 47 | $ 9 | Radar (50 pesquisas/mês), Tendências |
| **Pro** ⭐ | R$ 97 | $ 19 | Tudo ilimitado + Lean Canvas + CTO IA + Mentores |
| **All-Access VIP** | R$ 147 | $ 29 | Tudo do Pro + Landing Pages + Email Funnel + Suporte WhatsApp |

> Todos os planos são **pagamento único vitalício** — sem mensalidades.

---

## 🛠️ Stack Técnica

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Server Components)
- **UI:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- **Banco de Dados:** [Supabase](https://supabase.com) (PostgreSQL + Auth)
- **IA / LLM:** [Groq API](https://groq.com) (Llama 3.3 / Mixtral)
- **Pagamentos:** [Lemon Squeezy](https://lemonsqueezy.com)
- **Deploy:** [Vercel](https://vercel.com)
- **Animações:** [Framer Motion](https://www.framer.com/motion)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Chave de API da Groq

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/viralbook-ai.git
cd viralbook-ai
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um ficheiro `.env.local` na raiz com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Groq AI
GROQ_API_KEY=sua-groq-api-key

# Lemon Squeezy (Pagamentos)
NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL=https://viralbook.lemonsqueezy.com/checkout/buy/...
NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL=https://viralbook.lemonsqueezy.com/checkout/buy/...
NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL=https://viralbook.lemonsqueezy.com/checkout/buy/...
LEMON_SQUEEZY_WEBHOOK_SECRET=seu-webhook-secret

# App
NEXTAUTH_URL=http://localhost:3000
```

### 4. Configure a base de dados
```bash
# Execute os scripts SQL no painel do Supabase
# Os ficheiros estão em /database/
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no browser.

---

## 📁 Estrutura do Projeto

```
viralbook-ai/
├── src/
│   ├── app/
│   │   ├── (app)/              # Páginas autenticadas
│   │   │   ├── dashboard/      # Dashboard principal
│   │   │   ├── radar/          # Radar de nichos
│   │   │   ├── library/        # Biblioteca de ideias
│   │   │   ├── canvas/[id]/    # Lean Canvas
│   │   │   ├── advisors/       # Conselho de Mentores
│   │   │   ├── hunter/[id]/    # Teardown de produtos
│   │   │   ├── landing-pages/  # Gerador de Landing Pages
│   │   │   ├── email-funnel/   # Gerador de Email Funnel
│   │   │   ├── favorites/      # Favoritos
│   │   │   └── settings/       # Configurações
│   │   ├── api/                # API Routes (Next.js)
│   │   │   ├── radar/          # API do radar de nichos
│   │   │   ├── opportunities/  # CRUD de oportunidades
│   │   │   ├── trends/         # Ticker de tendências
│   │   │   ├── chat/           # API do CTO IA
│   │   │   └── webhooks/       # Webhooks Lemon Squeezy
│   │   ├── page.tsx            # Landing Page (pública)
│   │   └── login/             # Página de autenticação
│   ├── components/
│   │   ├── ui/                 # Componentes base (shadcn)
│   │   ├── opportunities-list.tsx  # Lista de oportunidades
│   │   ├── product-simulator.tsx   # Simulador interativo
│   │   ├── auth-modal.tsx          # Modal de autenticação
│   │   └── ...
│   └── services/
│       ├── GroqService.ts      # Serviço de IA (Groq)
│       └── supabase.ts         # Cliente Supabase
├── database/                   # Scripts SQL
├── public/                     # Assets estáticos
└── .env.local                  # Variáveis de ambiente (não commitado)
```

---

## 🌍 Deploy na Vercel

### Via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via Dashboard
1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório GitHub
3. Configure as variáveis de ambiente no painel
4. Clique em **Deploy**

> ⚠️ Adicione todas as variáveis de `.env.local` nas **Environment Variables** da Vercel antes de fazer o deploy.

---

## 📝 Variáveis de Ambiente (Referência Completa)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave pública do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Chave de serviço (server-side) |
| `GROQ_API_KEY` | ✅ | Chave da API Groq para IA |
| `NEXT_PUBLIC_LEMON_SQUEEZY_USD_URL` | ✅ | Link de checkout USD |
| `NEXT_PUBLIC_LEMON_SQUEEZY_BRL_URL` | ✅ | Link de checkout BRL |
| `NEXT_PUBLIC_LEMON_SQUEEZY_EUR_URL` | ✅ | Link de checkout EUR |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | ✅ | Secret para verificar webhooks |

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit as alterações: `git commit -m 'feat: minha feature'`
4. Push para a branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados © 2025 ViralBook AI.

---

<div align="center">
  <strong>Construído com ❤️ para founders que constroem coisas que importam.</strong>
</div>
