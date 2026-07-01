-- =================================================================================
-- MIGRAÇÃO: Privacidade Total (Zero-Knowledge) para Oportunidades
-- =================================================================================
-- Esta política garante que NEM MESMO administradores consigam acessar os dados gerados 
-- pelos usuários. Apenas o dono (owner) da oportunidade pode visualizá-la.

-- 1. Removemos a política anterior (que permitia leitura global e de owner)
DROP POLICY IF EXISTS "Enable select for owner and global" ON public.opportunities;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.opportunities;

-- 2. Criamos a nova política de Privacidade Total (Apenas Owner)
CREATE POLICY "Enable select for owner only" ON public.opportunities
    FOR SELECT USING (auth.uid() = user_id);

-- Notas: As políticas de INSERT, UPDATE e DELETE já estão restritas ao owner.
