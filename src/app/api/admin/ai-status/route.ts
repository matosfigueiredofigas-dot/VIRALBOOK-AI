import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getSetting } from '@/lib/settings';

interface ProviderStatus {
  name: string;
  key_name: string;
  status: 'online' | 'offline' | 'no_key' | 'error';
  latency_ms?: number;
  error?: string;
}

async function testGroq(apiKey: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Diz apenas "ok"' }],
        max_tokens: 5,
      }),
    });
    const latency = Date.now() - start;
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, latency, error: `HTTP ${res.status}` };
    }
    return { ok: true, latency };
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, error: e.message };
  }
}

async function testGemini(apiKey: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Diz apenas "ok"' }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      }
    );
    const latency = Date.now() - start;
    if (!res.ok) {
      if (res.status === 429) {
        return { ok: true, latency, error: ' (Limite Temporário)' };
      }
      return { ok: false, latency, error: `HTTP ${res.status}` };
    }
    return { ok: true, latency };
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, error: e.message };
  }
}

async function testOpenAI(apiKey: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Diz apenas "ok"' }],
        max_tokens: 5,
      }),
    });
    const latency = Date.now() - start;
    if (!res.ok) {
      return { ok: false, latency, error: `HTTP ${res.status}` };
    }
    return { ok: true, latency };
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, error: e.message };
  }
}

async function testAnthropic(apiKey: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Diz apenas "ok"' }],
      }),
    });
    const latency = Date.now() - start;
    if (!res.ok) {
      return { ok: false, latency, error: `HTTP ${res.status}` };
    }
    return { ok: true, latency };
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, error: e.message };
  }
}

async function testResend(apiKey: string): Promise<{ ok: boolean; latency: number; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const latency = Date.now() - start;
    if (!res.ok) {
      return { ok: false, latency, error: `HTTP ${res.status}` };
    }
    return { ok: true, latency };
  } catch (e: any) {
    return { ok: false, latency: Date.now() - start, error: e.message };
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const url = new URL(req.url);
    const testOnly = url.searchParams.get('test'); // ex: ?test=GROQ_API_KEY

    const providers = [
      { name: 'Groq', key_name: 'GROQ_API_KEY', testFn: testGroq },
      { name: 'Gemini', key_name: 'GEMINI_API_KEY', testFn: testGemini },
      { name: 'OpenAI (GPT)', key_name: 'OPENAI_API_KEY', testFn: testOpenAI },
      { name: 'Anthropic (Claude)', key_name: 'ANTHROPIC_API_KEY', testFn: testAnthropic },
      { name: 'Resend', key_name: 'RESEND_API_KEY', testFn: testResend },
    ];

    const filteredProviders = testOnly
      ? providers.filter(p => p.key_name === testOnly)
      : providers;

    const results: ProviderStatus[] = await Promise.all(
      filteredProviders.map(async (provider) => {
        const apiKey = await getSetting(provider.key_name);
        
        if (!apiKey) {
          return { name: provider.name, key_name: provider.key_name, status: 'no_key' as const };
        }

        const result = await provider.testFn(apiKey);
        return {
          name: provider.name,
          key_name: provider.key_name,
          status: result.ok ? 'online' as const : 'error' as const,
          latency_ms: result.latency,
          error: result.error,
        };
      })
    );

    return NextResponse.json({ providers: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
