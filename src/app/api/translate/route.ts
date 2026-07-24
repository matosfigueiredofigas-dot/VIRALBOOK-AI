import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder_key' });

export async function POST(request: Request) {
  try {
    const { items, payload, targetLanguage } = await request.json();

    if (!targetLanguage || targetLanguage === 'pt') {
      if (payload) return NextResponse.json({ translatedPayload: payload });
      return NextResponse.json({ translatedItems: items || [] });
    }

    const langName = targetLanguage === 'es' ? 'Spanish' : 'English';

    // 1. Caso seja um objeto único profundo (Ex: detalhes da oportunidade completa com blueprint)
    if (payload && typeof payload === 'object') {
      const systemPrompt = `You are a high-speed professional translator. Translate all human-readable natural text string values in the provided JSON object to ${langName}.
CRITICAL INSTRUCTIONS:
- Preserve the EXACT JSON structure, array lengths, and object key names (e.g. keep "problem_solved", "target_audience", "competitor_analysis", "gtm_roadmap", "pitch_deck", "tech_stack", "reddit_pain_points", "marketing_kit", "weeks", "slides", "scenes", etc. EXACTLY as they are).
- Do NOT translate URLs, code keywords, SQL queries, or technical identifiers.
- Translate user-facing descriptions, features, weaknesses, advantages, post copies, pitch slide contents, and pain point text smoothly into natural ${langName}.
- Return ONLY valid JSON in format: { "translatedPayload": ... }`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);

      return NextResponse.json({
        translatedPayload: parsed.translatedPayload || payload
      });
    }

    // 2. Caso seja um array de itens (Ex: lista de cartões de oportunidades)
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ translatedItems: [] });
    }

    const systemPrompt = `You are a high-speed professional translator. Translate all human-readable text string values in the provided JSON array to ${langName}. Preserve the exact JSON structure and object keys. Return ONLY valid JSON in format: { "translatedItems": [...] }`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(items) }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return NextResponse.json({
      translatedItems: parsed.translatedItems || items
    });
  } catch (error: any) {
    console.error('[Translate API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
