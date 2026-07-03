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

3. **Estrutura de Layout Obrigatória (Grid/Flex):**
   - \`h-screen w-full flex text-sm font-sans antialiased overflow-hidden\`
   - **Sidebar** (Largura fixa ex: \`w-64\`): Logo estilizada no topo, menu de navegação vertical com ícones FontAwesome (ex: Dashboard, Campanhas, Analytics, Configurações), perfil de usuário reduzido no rodapé.
   - **Main Content** (\`flex-1 flex flex-col\`):
     - **Topbar** (\`h-16 flex items-center justify-between px-8 border-b border-[#27272a]\`): Breadcrumbs (Home > Dashboard), Barra de Busca estilizada (\`bg-[#18181b] border border-[#27272a] rounded-lg\`), Ícone de Sino (com ponto vermelho absolute), e Avatar (https://i.pravatar.cc/150?img=11).
     - **Content Area** (\`flex-1 p-8 overflow-y-auto\`):
       - Título da página (H1 gigante, fonte semi-bold) e botão primário ("+ Nova Ação") com gradiente.
       - **Grid de Métricas (4 colunas):** 4 cards com o nome da métrica, um valor numérico grande, e um badge verde de crescimento (ex: <span class="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs">+12%</span>).
       - **Seção Central:** Crie uma área de "Visão Geral" contendo barras horizontais usando divs coloridas (\`bg-indigo-500\`) para simular um belo gráfico de performance ou funil.
       - **Tabela Inferior:** Uma tabela rica de "Atividades Recentes". Cabeçalhos cinzas (\`text-xs uppercase\`), linhas com hover (\`hover:bg-white/5\`), avatares redondos pequenos, e badges de status (Concluído, Pendente, Falhou).

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
