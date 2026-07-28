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
