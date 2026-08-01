-- Tabela para guardar os leads do eBook e controlar a sequência de emails
-- Executar no Supabase > SQL Editor

CREATE TABLE IF NOT EXISTS ebook_leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT DEFAULT '',
  sequence_day INTEGER DEFAULT 1,        -- Dia atual da sequência (1-6)
  active      BOOLEAN DEFAULT true,      -- false quando a sequência termina
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index para queries rápidas no cron job
CREATE INDEX IF NOT EXISTS idx_ebook_leads_active ON ebook_leads(active, sequence_day);

-- RLS: apenas o service role pode aceder (webhook + cron usam service role)
ALTER TABLE ebook_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON ebook_leads
  USING (true)
  WITH CHECK (true);
