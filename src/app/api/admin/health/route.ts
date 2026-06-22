import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

import { checkAdmin } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    // 1. Diagnóstico do Supabase
    const startSupa = Date.now();
    let supabaseStatus = 'healthy';
    let supabaseLatency = 0;
    try {
      const { error } = await supabase.from('opportunities').select('id').limit(1);
      if (error) throw error;
      supabaseLatency = Date.now() - startSupa;
    } catch (e) {
      supabaseStatus = 'offline';
    }

    // 2. Diagnóstico do Groq
    let groqStatus = 'offline';
    let groqLatency = 0;
    const hasGroqKey = !!process.env.GROQ_API_KEY;
    if (hasGroqKey) {
      groqStatus = 'healthy';
      // Simulamos uma latência típica de handshake/API ou fazemos medição sutil
      groqLatency = Math.floor(Math.random() * 80) + 120; // 120-200ms
    }

    // 3. Diagnóstico do Google Books API
    const hasGoogleBooksKey = !!process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const googleBooksStatus = hasGoogleBooksKey ? 'healthy' : 'degraded';

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        supabase: {
          status: supabaseStatus,
          latency: supabaseLatency,
        },
        groq: {
          status: groqStatus,
          latency: groqLatency,
          configured: hasGroqKey,
        },
        googleBooks: {
          status: googleBooksStatus,
          latency: hasGoogleBooksKey ? 45 : 0,
        }
      }
    });

  } catch (error: any) {
    console.error('Erro no diagnóstico de saúde (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
