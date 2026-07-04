-- Migration: Adicionar coluna launchpad_views à tabela opportunities
-- Objetivo: Rastrear quantas vezes a página pública (Landing Page gerada pelo Launchpad) foi visitada.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS launchpad_views INTEGER DEFAULT 0;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.launchpad_views IS 'Contador de visualizações (pageviews) da Landing Page pública hospedada pelo 1-Click Launchpad.';
