-- Adicionar coluna para armazenar o JSON do Ads Generator AI
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS ads_ai_json JSONB;
