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

-- Criar política de leitura pública (todos podem ler as oportunidades detectadas)
CREATE POLICY "Enable read access for all users" ON public.opportunities
    FOR SELECT USING (true);

-- Criar política de escrita apenas para usuários autenticados (ou sistema)
-- Por enquanto, permitindo tudo para facilitar o MVP local
CREATE POLICY "Enable insert for anonymous/service role" ON public.opportunities
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Enable update for anonymous/service role" ON public.opportunities
    FOR UPDATE USING (true);

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

-- Apenas o administrador moisesdematos@gmail.com ou admins gerais podem gerenciar
CREATE POLICY "Enable all actions for admin users" ON public.matrix_items
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'moisesdematos@gmail.com' 
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

