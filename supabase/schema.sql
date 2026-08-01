-- ==========================================
-- MASTER SUPABASE DATABASE SCHEMA FOR VIRALBOOK AI
-- Execute este script no Supabase > SQL Editor
-- (Contém DROP POLICY IF EXISTS para rodar sem erros se já existirem políticas)
-- ==========================================

-- Habilitar extensão uuid-ossp se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. TABELA PROFILES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' NOT NULL,
    plan TEXT DEFAULT 'free' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para criar perfil automaticamente quando um usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── 2. TABELA OPPORTUNITIES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    author TEXT NOT NULL,
    niche TEXT NOT NULL,
    rating NUMERIC(2,1),
    review_count INTEGER,
    cover_url TEXT,
    pain_point TEXT NOT NULL,
    micro_saas_idea TEXT NOT NULL,
    target_audience TEXT,
    business_model TEXT,
    estimated_mrr TEXT,
    score INTEGER DEFAULT 0,
    difficulty TEXT,
    search_keyword TEXT,
    
    -- Módulos Avançados
    market_teardown_json JSONB,
    gtm_roadmap JSONB,
    tech_stack JSONB,
    competitor_analysis JSONB,
    pitch_deck JSONB,
    sql_schema TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 3. TABELA FAVORITES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, opportunity_id)
);

-- ── 4. TABELA ADVISOR_CHAT_HISTORY ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.advisor_chat_history (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    advisor_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 5. TABELA LAUNCHPAD (LANDING PAGES) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.launchpad (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT NOT NULL,
    cta_text TEXT DEFAULT 'Garantir Acesso Antecipado',
    benefits JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    views_count INTEGER DEFAULT 0,
    subscribers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.launchpad_subscribers (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    launchpad_id UUID REFERENCES public.launchpad(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 6. TABELA SHOWCASE (PROJETOS DA COMUNIDADE) ──────────────────────
CREATE TABLE IF NOT EXISTS public.showcase_projects (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    demo_url TEXT,
    logo_url TEXT,
    category TEXT DEFAULT 'SaaS' NOT NULL,
    status TEXT DEFAULT 'approved' NOT NULL,
    upvotes_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.showcase_upvotes (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.showcase_projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.showcase_comments (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.showcase_projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ── 7. TABELA EBOOK_LEADS (FUNIL DE E-MAILS DO EBOOK) ────────────────
CREATE TABLE IF NOT EXISTS public.ebook_leads (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT DEFAULT '',
    sequence_day INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS (ROW LEVEL SECURITY) POLICIES ────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launchpad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launchpad_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_leads ENABLE ROW LEVEL SECURITY;

-- Drop de políticas existentes para evitar erro 42710 (policy already exists)
DROP POLICY IF EXISTS "Profiles select for owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update for owner" ON public.profiles;

DROP POLICY IF EXISTS "Enable select for owner only" ON public.opportunities;
DROP POLICY IF EXISTS "Enable select for owner and global" ON public.opportunities;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.opportunities;
DROP POLICY IF EXISTS "Opportunities insert for owner" ON public.opportunities;
DROP POLICY IF EXISTS "Opportunities update for owner" ON public.opportunities;
DROP POLICY IF EXISTS "Opportunities delete for owner" ON public.opportunities;

DROP POLICY IF EXISTS "Favorites select for owner" ON public.favorites;
DROP POLICY IF EXISTS "Favorites insert for owner" ON public.favorites;
DROP POLICY IF EXISTS "Favorites delete for owner" ON public.favorites;

DROP POLICY IF EXISTS "Chat history select for owner" ON public.advisor_chat_history;
DROP POLICY IF EXISTS "Chat history insert for owner" ON public.advisor_chat_history;

DROP POLICY IF EXISTS "Launchpad public select" ON public.launchpad;
DROP POLICY IF EXISTS "Launchpad insert for owner" ON public.launchpad;
DROP POLICY IF EXISTS "Launchpad update for owner" ON public.launchpad;

DROP POLICY IF EXISTS "Showcase public select" ON public.showcase_projects;
DROP POLICY IF EXISTS "Projetos aprovados são visíveis publicamente" ON public.showcase_projects;
DROP POLICY IF EXISTS "Showcase insert" ON public.showcase_projects;
DROP POLICY IF EXISTS "Utilizadores podem publicar projetos" ON public.showcase_projects;
DROP POLICY IF EXISTS "Donos podem editar os seus projetos" ON public.showcase_projects;
DROP POLICY IF EXISTS "Donos podem apagar os seus projetos" ON public.showcase_projects;

DROP POLICY IF EXISTS "Utilizadores podem ver os seus votos" ON public.showcase_upvotes;
DROP POLICY IF EXISTS "Utilizadores podem votar" ON public.showcase_upvotes;
DROP POLICY IF EXISTS "Utilizadores podem remover o seu voto" ON public.showcase_upvotes;

DROP POLICY IF EXISTS "Comentários são visíveis publicamente" ON public.showcase_comments;
DROP POLICY IF EXISTS "Utilizadores podem publicar comentários" ON public.showcase_comments;
DROP POLICY IF EXISTS "Autor pode apagar o seu comentário" ON public.showcase_comments;

DROP POLICY IF EXISTS "Service role full access" ON public.ebook_leads;

-- Recriação das Políticas
CREATE POLICY "Profiles select for owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles update for owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable select for owner only" ON public.opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Opportunities insert for owner" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Opportunities update for owner" ON public.opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Opportunities delete for owner" ON public.opportunities FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Favorites select for owner" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Favorites insert for owner" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Favorites delete for owner" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Chat history select for owner" ON public.advisor_chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Chat history insert for owner" ON public.advisor_chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Launchpad public select" ON public.launchpad FOR SELECT USING (true);
CREATE POLICY "Launchpad insert for owner" ON public.launchpad FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Launchpad update for owner" ON public.launchpad FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Showcase public select" ON public.showcase_projects FOR SELECT USING (status = 'approved');
CREATE POLICY "Showcase insert" ON public.showcase_projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access" ON public.ebook_leads USING (true) WITH CHECK (true);

-- ── ÍNDICES E RPC ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON public.opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_ebook_leads_active ON public.ebook_leads(active, sequence_day);
CREATE INDEX IF NOT EXISTS idx_showcase_upvotes_project ON public.showcase_upvotes(project_id);

CREATE OR REPLACE FUNCTION increment_showcase_upvote(project_id UUID)
RETURNS void AS $$
  UPDATE public.showcase_projects
  SET upvotes_count = upvotes_count + 1
  WHERE id = project_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_showcase_upvote(project_id UUID)
RETURNS void AS $$
  UPDATE public.showcase_projects
  SET upvotes_count = GREATEST(upvotes_count - 1, 0)
  WHERE id = project_id;
$$ LANGUAGE sql SECURITY DEFINER;
