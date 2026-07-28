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
