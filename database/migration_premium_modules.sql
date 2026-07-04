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
