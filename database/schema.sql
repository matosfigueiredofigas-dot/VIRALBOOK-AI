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
