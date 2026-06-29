-- Migration: Adicionar coluna search_keyword à tabela opportunities
-- Objetivo: Persistir a keyword original usada nas buscas do Facebook/Reddit/Trends
--           para garantir que os links da Ads Library apontem para o mesmo termo
--           que gerou os números exibidos no card (facebook_ads_count, facebook_groups_count).
--
-- Como rodar: Execute este SQL no painel do Supabase > SQL Editor

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS search_keyword TEXT;

-- Comentário de documentação
COMMENT ON COLUMN public.opportunities.search_keyword IS 
  'Keyword original usada para as buscas nas APIs (Facebook, Reddit, Trends). '
  'Garante sincronia entre os números exibidos e os links da Ads Library. '
  'Ex: "Dentistas" (e não o target_audience refinado pela IA "Clínicas Odontológicas que buscam automatização").';
