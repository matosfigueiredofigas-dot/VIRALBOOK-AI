import Groq from 'groq-sdk';
import { getSetting } from '@/lib/settings';

type Message = { role: string; content: string };

interface GenerateOptions {
  messages: Message[];
  model?: string; // model to use for Groq
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

/**
 * Mapeia mensagens do formato OpenAI/Groq para o formato exigido pelo Gemini REST API.
 */
function formatMessagesForGemini(messages: Message[]) {
  const contents: any[] = [];
  let systemInstruction: any = null;

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction = {
        parts: [{ text: msg.content }]
      };
    } else {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
  }

  return { contents, systemInstruction };
}

/**
 * Tenta usar o Groq primeiro. Se falhar, recorre automaticamente ao Gemini 1.5 Flash.
 */
export async function generateWithFallback(options: GenerateOptions): Promise<string> {
  const { messages, model = 'llama-3.1-8b-instant', temperature = 0.7, max_tokens = 1500, response_format } = options;

  let lastError: any = null;

  // 1. Tentar com Groq
  try {
    const groqKey = await getSetting('GROQ_API_KEY');
    if (!groqKey) {
      throw new Error("GROQ_API_KEY não configurada na base de dados nem no .env");
    }

    const groq = new Groq({ apiKey: groqKey });

    console.log(`[AI Fallback] Tentando Groq com modelo: ${model}...`);
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model,
      temperature,
      max_tokens,
      response_format,
    });
    
    const reply = completion.choices[0]?.message?.content || '';
    if (reply) {
      console.log(`[AI Fallback] Sucesso via Groq (${model})`);
      return reply;
    }
  } catch (error: any) {
    console.warn(`[AI Fallback] Falha no Groq (${model}). Erro:`, error.message || error);
    lastError = error;
  }

  // 2. Tentar com Gemini (Fallback 1)
  try {
    const geminiKey = await getSetting('GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error("GEMINI_API_KEY não configurada");
    }

    console.log(`[AI Fallback] Recorrendo ao Gemini (gemini-1.5-flash)...`);
    
    const { contents, systemInstruction } = formatMessagesForGemini(messages);
    
    const payload: any = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: max_tokens,
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = systemInstruction;
    }

    if (response_format?.type === 'json_object') {
      payload.generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.text();
      throw new Error(`Erro Gemini API: ${response.status} - ${errData}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (reply) {
      console.log(`[AI Fallback] Sucesso via Gemini (gemini-1.5-flash)`);
      return reply;
    }

  } catch (error: any) {
    console.error(`[AI Fallback] Falha crítica no Gemini. Erro:`, error.message || error);
    lastError = error;
  }

  throw new Error(`Todos os provedores de IA falharam. Último erro: ${lastError?.message || lastError}`);
}
