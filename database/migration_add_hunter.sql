-- Adicionar coluna para armazenar o JSON do Hunter AI (Leads B2B)
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS hunter_ai_json JSONB;
