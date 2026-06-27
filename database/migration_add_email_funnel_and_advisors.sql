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
