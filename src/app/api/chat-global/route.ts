import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai-generate';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { messages, url, pageContent, language = 'pt' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese (Brazil)';

    // DB X-RAY (Buscar dados do utilizador)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let dbContext = "O utilizador não está autenticado ou não tem ideias salvas.";
    if (user) {
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('title, nicho, saas_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (opportunities && opportunities.length > 0) {
        dbContext = "O utilizador tem as seguintes ideias salvas nos seus Favoritos:\n" + 
          opportunities.map(o => `- ${o.saas_name || o.title} (Nicho: ${o.nicho})`).join("\n");
      } else {
        dbContext = "O utilizador ainda não salvou nenhuma oportunidade/ideia.";
      }
    }

    const systemPrompt = {
      role: 'system',
      content: `Você é o "ViralBot", o Assistente Virtual e Guia Especialista Oficial da plataforma "ViralBook AI".
O usuário está utilizando a plataforma neste momento, e o URL em que ele se encontra é: ${url}

**RAIO-X DA BASE DE DADOS DO UTILIZADOR:**
${dbContext}
Pode usar esta informação proativamente. Por exemplo, se ele perguntar o que fazer a seguir, sugira trabalhar numa das ideias que ele já guardou.

**O QUE O UTILIZADOR ESTÁ A VER NESTE MOMENTO (TEXTO DA TELA):**
<screen_text>
${pageContent || "Nenhum texto detetado na tela no momento."}
</screen_text>

**FORMATO DE RESPOSTA OBRIGATÓRIO:**
Você deve responder SEMPRE em formato JSON válido e estrito. O JSON deve ter a seguinte estrutura:
{
  "reply": "Sua resposta de texto formatada com Markdown. Sempre no idioma ${targetLang}.",
  "auto_navigate_to": "/url-a-navegar", // OPCIONAL. Só inclua se o usuário pedir para ser levado a alguma página ou ferramenta (ex: "/favorites", "/email-funnel", "/radar", "/landing-pages"). Se não for para navegar, retorne null.
  "suggested_actions": [ // OPCIONAL. Array com até 3 botões rápidos que o utilizador pode clicar.
    { "label": "Título do Botão", "url": "/url-para-ir" }
  ],
  "trigger_auto_builder": "Palavra-chave ou Título do Livro" // OPCIONAL. Só inclua se o usuário pedir explicitamente para "criar um SaaS" ou "gerar tudo" sobre um tema específico. Se não, retorne null.
}

**CONHECIMENTO DA PLATAFORMA VIRALBOOK AI E SEUS BOTÕES:**
O ViralBook AI analisa livros/tendências para criar Micro-SaaS.
- **Ideias e Radar:** Para procurar nichos e livros (/radar) ou ver Biblioteca de Ideias (/library).
- **Os Meus Projetos:** As ideias geradas ficam nos Favoritos (/favorites).
- **IMPORTANTE SOBRE FERRAMENTAS:** As ferramentas Lean Canvas, Landing Pages, Email Funnel e Ad Factory SÓ podem ser acedidas a partir de dentro de um projeto gerado (em /favorites). Nunca forneça botões ou links diretos para "/canvas", "/generator" ou "/email-funnel" sem o ID do projeto! Se o utilizador quiser aceder a essas ferramentas, diga-lhe para ir aos Favoritos (/favorites) e abrir o projeto desejado.

Se o utilizador pedir para **"criar"**, **"gerar"** ou **"construir"** um SaaS inteiro sobre um livro ou tema (ex: "Cria um SaaS sobre Hábitos Atómicos"), **não lhe dê instruções passo a passo**. Apenas preencha a propriedade \`trigger_auto_builder\` com a palavra-chave e diga no \`reply\`: "Entendido! O Auto-Builder entrou em ação. A preparar os motores..."

CRITICAL INSTRUCTION: Respond ALL questions strictly in JSON format as defined above. Dê respostas calorosas e super práticas.`
    };

    const payloadMessages = [systemPrompt, ...messages];

    const reply = await generateWithFallback({
      messages: payloadMessages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    // Garantir que a resposta da IA está estruturada
    let jsonReply;
    try {
      jsonReply = JSON.parse(reply);
    } catch (e) {
      console.warn("Failed to parse JSON from AI, wrapping in default structure:", reply);
      jsonReply = { reply: reply };
    }

    return NextResponse.json(jsonReply);

  } catch (error: any) {
    console.error('Erro na rota de Chat AI Global:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar conversa.' }, { status: 500 });
  }
}
