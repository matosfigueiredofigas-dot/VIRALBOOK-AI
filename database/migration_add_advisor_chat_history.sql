-- Migration: Adicionar coluna advisor_chat_history à tabela opportunities
-- Objetivo: Armazenar o histórico persistente das conversas com os mentores holográficos.
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS advisor_chat_history JSONB DEFAULT '{}'::jsonb;

-- Comentários de documentação
COMMENT ON COLUMN public.opportunities.advisor_chat_history IS 'Histórico de conversas com os mentores (Chat), agrupado pelo nome do mentor.';
