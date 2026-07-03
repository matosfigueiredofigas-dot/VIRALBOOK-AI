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
