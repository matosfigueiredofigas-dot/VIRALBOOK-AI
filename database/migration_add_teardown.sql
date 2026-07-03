-- Adicionar coluna para armazenar o JSON do Market Teardown
ALTER TABLE public.opportunities
ADD COLUMN IF NOT EXISTS market_teardown_json JSONB;
