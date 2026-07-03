import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const { saasName, problem, audience, features } = await req.json();

    if (!saasName || !problem) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios' }, { status: 400 });
    }

    const prompt = `
Você é o Lead UI/UX Designer e Desenvolvedor Frontend Sênior da Linear e da Vercel.
Sua missão é escrever o código HTML/TailwindCSS perfeito e de cair o queixo para o Dashboard de um novo SaaS.
O resultado DEVE ser uma obra de arte do design de software B2B: moderno, sério, limpo e absurdamente premium.

Nome do SaaS: ${saasName}
Público Alvo: ${audience}
Problema: ${problem}
Funcionalidades MVP: ${features}

DIRETRIZES DE DESIGN ESTRITAS (Siga todas!):
1. **Esquema de Cores (Premium Dark Mode):**
   - Fundo principal: \`bg-[#09090b]\`
   - Sidebar e Header: \`bg-[#09090b] border-r border-b border-[#27272a]\`
   - Cards e Paineis: \`bg-[#18181b] border border-[#27272a] rounded-xl\`
   - Texto principal: \`text-zinc-100\`, Texto secundário: \`text-zinc-400\`
   - Destaques (Accent): Use um gradiente sutil como \`bg-gradient-to-r from-indigo-500 to-violet-500\` para botões primários.
   - Brilho sutil: Adicione \`shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]\` em cards importantes.

2. **Micro-interações (Hover States):**
   - Todos os botões, links da sidebar e cards de métricas DEVEM ter \`transition-all duration-200\`.
   - No hover de cards: \`hover:border-zinc-700 hover:bg-[#202024]\`.

3. **Estrutura de Layout Obrigatória (Grid/Flex) e SPA (Single Page Application):**
   - \`h-screen w-full flex text-sm font-sans antialiased overflow-hidden\`
   - **Sidebar** (Largura fixa ex: \`w-64 flex flex-col p-4\`): Logo estilizada no topo. Menu de navegação vertical com IDs nos links (ex: id="btn-dashboard", id="btn-analytics", id="btn-config"). IMPORTANTE: Os links DEVEM ser totalmente clicáveis (\`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white cursor-pointer transition-colors\`). A tab ativa deve ter \`bg-white/10 text-white font-medium\`.
   - **Main Content** (\`flex-1 flex flex-col\`):
     - **Topbar**: Breadcrumbs dinâmicos, Barra de Busca, Ícone de Sino, Avatar.
     - **Views (Telas Interativas)**: Você DEVE criar 3 "Telas" (seções div) diferentes dentro da Content Area:
       1. **Dashboard** (id="view-dashboard"): A tela principal com os 4 Cards de Métricas, Gráfico e Tabela de Atividades Recentes.
       2. **Analytics** (id="view-analytics", oculta por padrão \`hidden\`): Uma tela simulando relatórios detalhados.
       3. **Configurações** (id="view-config", oculta por padrão \`hidden\`): Uma tela simulando formulários de perfil, preferências de notificação e faturamento.
     - **JavaScript (Vanilla)**: Inclua uma tag \`<script>\` no final do body com a lógica para fazer a transição entre essas telas. Ao clicar em um link da sidebar, esconda as outras telas, mostre a selecionada, e atualize o estilo visual do link ativo na sidebar. Mude também o texto do Breadcrumb na Topbar.

4. **Regras Técnicas:**
   - Use <script src="https://cdn.tailwindcss.com"></script>
   - Importe fonte: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
   - Importe FontAwesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
   - Aplique CSS na tag body: \`style="font-family: 'Inter', sans-serif;"\`
   - Popule o Dashboard com **DADOS FICTÍCIOS REAIS** que façam total sentido para o nicho de ${saasName}. Nada de Lorem Ipsum.

Retorne APENAS CÓDIGO HTML VÁLIDO. Sem markdown (\`\`\`), sem introduções, sem saudações. Comece no <!DOCTYPE html> e termine no </html>.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // Usando um modelo forte para geração de código
      temperature: 0.2, // Baixa temperatura para código estruturado e focado
    });

    let htmlCode = chatCompletion.choices[0]?.message?.content || '';

    // Limpeza de possíveis blocos de markdown que o LLM possa retornar por erro
    htmlCode = htmlCode.replace(/```html/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ html: htmlCode });
  } catch (error: any) {
    console.error('[LivePreview] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Live Preview' }, { status: 500 });
  }
}
