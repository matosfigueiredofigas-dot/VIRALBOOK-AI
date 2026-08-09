-- ==========================================
-- MASTER SUPABASE DATABASE SCHEMA FOR VIRALBOOK AI
-- Execute this script in your Supabase SQL Editor
-- ==========================================

-- ------------------------------------------
-- File: database/schema.sql
-- ------------------------------------------
-- Tabela principal de Oportunidades (SaaS / Apps gerados a partir de Ebooks)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Dados do Ebook Original
    book_title TEXT NOT NULL,
    book_author TEXT,
    book_category TEXT,
    book_description TEXT,
    country TEXT NOT NULL,
    
    -- Métricas de Crescimento e Score
    trends_growth_weekly DECIMAL(5,2),
    trends_growth_monthly DECIMAL(5,2),
    reddit_mentions INTEGER,
    facebook_ads_count INTEGER DEFAULT 0,
    facebook_groups_count INTEGER DEFAULT 0,
    viral_opportunity_score INTEGER NOT NULL DEFAULT 0, -- 0 a 100
    
    -- Insights da IA (Motor Ebook -> Startup)
    saas_name TEXT NOT NULL,
    problem_solved TEXT,
    target_audience TEXT,
    competitive_advantage TEXT,
    mvp_features TEXT,
    monetization_model TEXT,
    suggested_price TEXT,
    potential_revenue TEXT,
    implementation_difficulty TEXT, -- Baixa, Média, Alta
    development_time TEXT,
    
    -- Prompts Gerados
    prompt_lovable TEXT,
    prompt_bolt TEXT,
    prompt_cursor TEXT,
    
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Criar política de leitura restringida ao proprietário ou registros globais
DROP POLICY IF EXISTS "Enable read access for all users" ON public.opportunities;
CREATE POLICY "Enable select for owner and global" ON public.opportunities
    FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

-- Criar política de escrita e modificação restrita ao proprietário autenticado
DROP POLICY IF EXISTS "Enable insert for anonymous/service role" ON public.opportunities;
CREATE POLICY "Enable insert for authenticated owner" ON public.opportunities
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
DROP POLICY IF EXISTS "Enable update for anonymous/service role" ON public.opportunities;
CREATE POLICY "Enable update for owner" ON public.opportunities
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for owner" ON public.opportunities;
CREATE POLICY "Enable delete for owner" ON public.opportunities
    FOR DELETE USING (auth.uid() = user_id);

-- Índices de performance para escala de 100.000+ registros
CREATE INDEX IF NOT EXISTS idx_opportunities_country ON public.opportunities(country);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON public.opportunities(user_id);

-- Extensão de busca rápida por texto (trigrama)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_opportunities_search_trgm ON public.opportunities USING gin (saas_name gin_trgm_ops, problem_solved gin_trgm_ops);

-- Tabela para armazenar os itens dinâmicos das matrizes de nichos
CREATE TABLE IF NOT EXISTS public.matrix_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('audience', 'problem', 'technology', 'monetization')),
    name TEXT NOT NULL,
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_type_name UNIQUE (type, name)
);

-- Habilitar RLS
ALTER TABLE public.matrix_items ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário pode consultar os itens da matriz
CREATE POLICY "Enable read access for all users" ON public.matrix_items
    FOR SELECT USING (true);

-- Função helper para verificar se o usuário é admin sem causar recursão de RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'moisesdematos@gmail.com' 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apenas o administrador moisesdematos@gmail.com ou admins gerais podem gerenciar
CREATE POLICY "Enable all actions for admin users" ON public.matrix_items
    FOR ALL USING (
        public.is_admin()
    );

-- =========================================================================
-- POLÍTICAS DE PRIVACIDADE E RLS PARA AS DEMAIS TABELAS
-- =========================================================================

-- Habilitar RLS para landing_pages
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Permitir leitura pública das landing pages (visitantes e dono)
DROP POLICY IF EXISTS "Enable public read for landing_pages" ON public.landing_pages;
CREATE POLICY "Enable public read for landing_pages" ON public.landing_pages
    FOR SELECT USING (true);

-- 2. INSERT: Apenas donos autenticados criam landing pages
DROP POLICY IF EXISTS "Enable insert for authenticated owner" ON public.landing_pages;
CREATE POLICY "Enable insert for authenticated owner" ON public.landing_pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE/DELETE: Apenas donos modificam ou removem
DROP POLICY IF EXISTS "Enable update for owner" ON public.landing_pages;
CREATE POLICY "Enable update for owner" ON public.landing_pages
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Enable delete for owner" ON public.landing_pages;
CREATE POLICY "Enable delete for owner" ON public.landing_pages
    FOR DELETE USING (auth.uid() = user_id);


-- Habilitar RLS para waitlist_leads
ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

-- 1. INSERT: Qualquer visitante pode se cadastrar
DROP POLICY IF EXISTS "Enable insert for all" ON public.waitlist_leads;
CREATE POLICY "Enable insert for all" ON public.waitlist_leads
    FOR INSERT WITH CHECK (true);

-- 2. SELECT: Apenas o dono da landing page lê os leads capturados
DROP POLICY IF EXISTS "Enable read for landing page owner" ON public.waitlist_leads;
CREATE POLICY "Enable read for landing page owner" ON public.waitlist_leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE public.landing_pages.id = public.waitlist_leads.landing_page_id 
            AND public.landing_pages.user_id = auth.uid()
        )
    );




-- Tabela de configura��es do sistema (Motor de IA)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.system_settings
    FOR SELECT USING (true);

CREATE POLICY "Enable all actions for admin users" ON public.system_settings
    FOR ALL USING (public.is_admin());


-- ------------------------------------------
-- File: database/migration_add_ads.sql
-- ------------------------------------------
-- Adicionar coluna para armazenar o JSON do Ads Generator AI
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS ads_ai_json JSONB;


-- ------------------------------------------
-- File: database/migration_add_advisor_chat_history.sql
-- ------------------------------------------
-- Migration: Adicionar coluna advisor_chat_history à tabela opportunities
-- Objetivo: Armazenar o histórico persistente das conversas com os mentores holográficos.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS advisor_chat_history JSONB DEFAULT '{}'::jsonb;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.advisor_chat_history IS 'Histórico de conversas com os mentores (Chat), agrupado pelo nome do mentor.';


-- ------------------------------------------
-- File: database/migration_add_email_funnel_and_advisors.sql
-- ------------------------------------------
-- Migration: Adicionar colunas email_funnel e advisor_advice à tabela opportunities
-- Objetivo: Armazenar as sequências de e-mails geradas e os conselhos de mentores gerados por IA.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS email_funnel JSONB,
  ADD COLUMN IF NOT EXISTS advisor_advice JSONB;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.email_funnel IS 'Sequência lógica de e-mails de lançamento gerados pela IA.';
COMMENT ON COLUMN public.opportunities.advisor_advice IS 'Feedback estratégico simulado dos mentores de startups (Paul Graham, Steve Jobs, levelsio, Naval).';


-- ------------------------------------------
-- File: database/migration_add_hunter.sql
-- ------------------------------------------
-- Adicionar coluna para armazenar o JSON do Hunter AI (Leads B2B)
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS hunter_ai_json JSONB;


-- ------------------------------------------
-- File: database/migration_add_launchpad.sql
-- ------------------------------------------
-- Adicionar colunas para o 1-Click Launchpad na tabela opportunities
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS landing_page_html TEXT,
ADD COLUMN IF NOT EXISTS published_slug TEXT UNIQUE;

-- Criar tabela para armazenar os Leads capturados pelas Landing Pages
CREATE TABLE IF NOT EXISTS public.opportunity_leads (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security) na nova tabela
ALTER TABLE public.opportunity_leads ENABLE ROW LEVEL SECURITY;

-- Política 1: Qualquer um pode inserir um Lead (pois a Landing Page é pública)
CREATE POLICY "Permitir inserção pública de leads" 
ON public.opportunity_leads 
FOR INSERT 
WITH CHECK (true);

-- Política 2: O dono da oportunidade pode ver seus próprios leads
CREATE POLICY "Donos podem ver seus próprios leads" 
ON public.opportunity_leads 
FOR SELECT 
USING (
    opportunity_id IN (
        SELECT id FROM public.opportunities WHERE user_id = auth.uid()
    )
);

-- Política 3: O dono da oportunidade pode deletar seus próprios leads
CREATE POLICY "Donos podem deletar seus próprios leads" 
ON public.opportunity_leads 
FOR DELETE 
USING (
    opportunity_id IN (
        SELECT id FROM public.opportunities WHERE user_id = auth.uid()
    )
);


-- ------------------------------------------
-- File: database/migration_add_launchpad_views.sql
-- ------------------------------------------
-- Migration: Adicionar coluna launchpad_views à tabela opportunities
-- Objetivo: Rastrear quantas vezes a página pública (Landing Page gerada pelo Launchpad) foi visitada.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS launchpad_views INTEGER DEFAULT 0;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.launchpad_views IS 'Contador de visualizações (pageviews) da Landing Page pública hospedada pelo 1-Click Launchpad.';


-- ------------------------------------------
-- File: database/migration_add_search_keyword.sql
-- ------------------------------------------
-- Migration: Adicionar coluna search_keyword à tabela opportunities
-- Objetivo: Persistir a keyword original usada nas buscas do Facebook/Reddit/Trends
--           para garantir que os links da Ads Library apontem para o mesmo termo
--           que gerou os números exibidos no card (facebook_ads_count, facebook_groups_count).
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS search_keyword TEXT;

-- Comentário de documentação
COMMENT ON COLUMN public.opportunities.search_keyword IS 
  'Keyword original usada para as buscas nas APIs (Facebook, Reddit, Trends). '
  'Garante sincronia entre os números exibidos e os links da Ads Library. '
  'Ex: "Dentistas" (e não o target_audience refinado pela IA "Clínicas Odontológicas que buscam automatização").';


-- ------------------------------------------
-- File: database/migration_add_showcase.sql
-- ------------------------------------------
-- ============================================================
-- SHOWCASE DA COMUNIDADE — Migração
-- ============================================================

-- Tabela principal de projetos publicados pela comunidade
CREATE TABLE IF NOT EXISTS public.showcase_projects (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    screenshot_url TEXT,
    category TEXT NOT NULL DEFAULT 'SaaS',
    tags TEXT[] DEFAULT '{}',
    upvotes_count INT DEFAULT 0 NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de upvotes (1 voto por utilizador por projeto)
CREATE TABLE IF NOT EXISTS public.showcase_upvotes (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.showcase_projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Ativar RLS
ALTER TABLE public.showcase_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_upvotes ENABLE ROW LEVEL SECURITY;

-- ── Policies: showcase_projects ──

-- Qualquer um pode VER projetos aprovados (incluindo não autenticados)
CREATE POLICY "Projetos aprovados são visíveis publicamente"
ON public.showcase_projects FOR SELECT
USING (status = 'approved');

-- Utilizador autenticado pode inserir o seu próprio projeto
CREATE POLICY "Utilizadores podem publicar projetos"
ON public.showcase_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Dono pode editar o seu projeto
CREATE POLICY "Donos podem editar os seus projetos"
ON public.showcase_projects FOR UPDATE
USING (auth.uid() = user_id);

-- Dono pode apagar o seu projeto
CREATE POLICY "Donos podem apagar os seus projetos"
ON public.showcase_projects FOR DELETE
USING (auth.uid() = user_id);

-- ── Policies: showcase_upvotes ──

-- Utilizador autenticado pode ver os seus votos
CREATE POLICY "Utilizadores podem ver os seus votos"
ON public.showcase_upvotes FOR SELECT
USING (auth.uid() = user_id);

-- Utilizador autenticado pode votar
CREATE POLICY "Utilizadores podem votar"
ON public.showcase_upvotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Utilizador autenticado pode remover o seu voto
CREATE POLICY "Utilizadores podem remover o seu voto"
ON public.showcase_upvotes FOR DELETE
USING (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_showcase_projects_status ON public.showcase_projects(status);
CREATE INDEX IF NOT EXISTS idx_showcase_projects_category ON public.showcase_projects(category);
CREATE INDEX IF NOT EXISTS idx_showcase_projects_upvotes ON public.showcase_projects(upvotes_count DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_upvotes_project ON public.showcase_upvotes(project_id);
CREATE INDEX IF NOT EXISTS idx_showcase_upvotes_user ON public.showcase_upvotes(user_id);

-- ── RPC Functions para upvote atómico ──

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


-- ------------------------------------------
-- File: database/migration_add_showcase_comments.sql
-- ------------------------------------------
-- ============================================================
-- SHOWCASE COMENTÁRIOS & FEEDBACK — Migração
-- ============================================================

CREATE TABLE IF NOT EXISTS public.showcase_comments (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES public.showcase_projects(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.showcase_comments ENABLE ROW LEVEL SECURITY;

-- Qual quer um pode ver os comentários
CREATE POLICY "Comentários são visíveis publicamente"
ON public.showcase_comments FOR SELECT
USING (true);

-- Utilizadores autenticados podem comentar
CREATE POLICY "Utilizadores podem publicar comentários"
ON public.showcase_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Autor pode apagar o seu comentário
CREATE POLICY "Autor pode apagar o seu comentário"
ON public.showcase_comments FOR DELETE
USING (auth.uid() = user_id);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_showcase_comments_project ON public.showcase_comments(project_id);


-- ------------------------------------------
-- File: database/migration_add_teardown.sql
-- ------------------------------------------
-- Adicionar coluna para armazenar o JSON do Market Teardown
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS market_teardown_json JSONB;


-- ------------------------------------------
-- File: database/migration_premium_modules.sql
-- ------------------------------------------
-- Migration: Adicionar colunas JSONB e TEXT para novos módulos premium de IA das Oportunidades
-- Objetivo: Armazenar Roadmap GTM, Tech Stack, Análise de Concorrentes, Pitch Deck e SQL Schema gerados sob demanda.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS gtm_roadmap JSONB,
  ADD COLUMN IF NOT EXISTS tech_stack JSONB,
  ADD COLUMN IF NOT EXISTS competitor_analysis JSONB,
  ADD COLUMN IF NOT EXISTS pitch_deck JSONB,
  ADD COLUMN IF NOT EXISTS sql_schema TEXT;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.gtm_roadmap IS 'Plano de Ação Go-To-Market de 30 dias gerado por IA.';
COMMENT ON COLUMN public.opportunities.tech_stack IS 'Recomendação de ferramentas e arquitetura gerada por IA.';
COMMENT ON COLUMN public.opportunities.competitor_analysis IS 'Análise de concorrentes indiretos e diretos gerada por IA.';
COMMENT ON COLUMN public.opportunities.pitch_deck IS 'Slides HTML do pitch deck para captação.';
COMMENT ON COLUMN public.opportunities.sql_schema IS 'Arquitetura de banco de dados SQL (Supabase) gerada por IA.';


-- ------------------------------------------
-- File: database/migration_rls_privacy.sql
-- ------------------------------------------
-- =================================================================================
-- MIGRAÇÃO: Privacidade Total (Zero-Knowledge) para Oportunidades
-- =================================================================================
-- Esta política garante que NEM MESMO administradores consigam acessar os dados gerados 
-- pelos usuários. Apenas o dono (owner) da oportunidade pode visualizá-la.

-- 1. Removemos a política anterior (que permitia leitura global e de owner)
DROP POLICY IF EXISTS "Enable select for owner and global" ON public.opportunities;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.opportunities;

-- 2. Criamos a nova política de Privacidade Total (Apenas Owner)
CREATE POLICY "Enable select for owner only" ON public.opportunities
    FOR SELECT USING (auth.uid() = user_id);

-- Notas: As políticas de INSERT, UPDATE e DELETE já estão restritas ao owner.


-- ------------------------------------------
-- File: supabase/migrations/20250801_ebook_leads.sql
-- ------------------------------------------
-- Tabela para guardar os leads do eBook e controlar a sequência de emails
-- Executar no Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS ebook_leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT DEFAULT '',
  sequence_day INTEGER DEFAULT 1,        -- Dia atual da sequência (1-6)
  active      BOOLEAN DEFAULT true,      -- false quando a sequência termina
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index para queries rápidas no cron job
CREATE INDEX IF NOT EXISTS idx_ebook_leads_active ON ebook_leads(active, sequence_day);

-- RLS: apenas o service role pode aceder (webhook + cron usam service role)
ALTER TABLE ebook_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON ebook_leads
  USING (true)
  WITH CHECK (true);


- -   G L O B A L   C H A T   M E M O R Y   T A B L E  
 C R E A T E   T A B L E   I F   N O T   E X I S T S   p u b l i c . v i r a l b o t _ c h a t s   (  
     i d   U U I D   P R I M A R Y   K E Y   D E F A U L T   g e n _ r a n d o m _ u u i d ( ) ,  
     u s e r _ i d   U U I D   R E F E R E N C E S   a u t h . u s e r s   N O T   N U L L ,  
     r o l e   T E X T   N O T   N U L L   C H E C K   ( r o l e   I N   ( ' u s e r ' ,   ' a s s i s t a n t ' ) ) ,  
     c o n t e n t   T E X T   N O T   N U L L ,  
     c r e a t e d _ a t   T I M E S T A M P   W I T H   T I M E   Z O N E   D E F A U L T   t i m e z o n e ( ' u t c ' : : t e x t ,   n o w ( ) )   N O T   N U L L  
 ) ;  
  
 - -   R L S   p a r a   v i r a l b o t _ c h a t s  
 A L T E R   T A B L E   p u b l i c . v i r a l b o t _ c h a t s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   \  
 U s e r s  
 c a n  
 v i e w  
 o w n  
 v i r a l b o t _ c h a t s \   O N   p u b l i c . v i r a l b o t _ c h a t s   F O R   S E L E C T   U S I N G   ( a u t h . u i d ( )   =   u s e r _ i d ) ;  
 C R E A T E   P O L I C Y   \  
 U s e r s  
 c a n  
 i n s e r t  
 o w n  
 v i r a l b o t _ c h a t s \   O N   p u b l i c . v i r a l b o t _ c h a t s   F O R   I N S E R T   W I T H   C H E C K   ( a u t h . u i d ( )   =   u s e r _ i d ) ;  
 