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

3. **Estrutura de Layout Obrigatória (Grid de 3 Colunas) e SPA:**
   - O Body deve ser \`h-screen w-full flex bg-[#09090b] text-sm font-sans antialiased overflow-hidden text-zinc-100\`
   - **Coluna 1: Sidebar Esquerda** (\`w-64 flex flex-col p-4 border-r border-[#27272a]\`): Logo estilizada. Menu de navegação (Dashboard, Analytics, Configurações). Botões de ação rápida.
   - **Coluna 2: Main Content** (\`flex-1 flex flex-col overflow-y-auto relative\`):
     - **Header**: Barra de busca, Breadcrumbs.
     - **Banner de Boas-Vindas**: Uma div larga no topo com um mesh gradient incrivelmente vibrante (ex: \`bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600\`), texto de boas vindas, e um botão "Upgrade to Pro".
     - **Grid de Métricas (3 ou 4 colunas)**: Cards com Glassmorphism (\`bg-[#18181b]/80 backdrop-blur border border-[#27272a] shadow-xl\`).
     - **Gráfico Real (Chart.js)**: Uma área grande contendo um \`<canvas id="mainChart"></canvas>\` para renderizar um gráfico de crescimento.
     - **Tabela de Dados**: Tabela complexa de "Últimas Transações" ou "Ações" com avatares, nomes, datas e badges de status coloridos.
   - **Coluna 3: Right Panel / Feed** (\`w-80 border-l border-[#27272a] bg-[#0c0c0e] p-6 hidden lg:block overflow-y-auto\`): 
     - **Perfil Rápido**: Avatar grande, nome, email.
     - **Uso de Quota (Progress Bar)**: Ex: "80% do limite mensal atingido".
     - **Activity Feed**: Uma timeline vertical de eventos recentes (ex: "Novo usuário cadastrado há 5 min", com bolinhas conectadas por uma linha).

4. **Regras Técnicas e Bibliotecas (ESSENCIAL PARA FUNCIONAR):**
   - Importe TailwindCSS: <script src="https://cdn.tailwindcss.com"></script>
   - Importe FontAwesome: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
   - Importe Chart.js: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   - Importe Google Fonts (Inter).
   - **JavaScript (Vanilla)**: No final do arquivo, adicione um \`<script>\` que:
     1. Faça a lógica de abas (SPA) para esconder/mostrar as seções.
     2. Inicialize o \`mainChart\` usando \`new Chart(ctx, { ... })\` criando um belo Line Chart escuro com preenchimento (fill) violeta/gradiente, simulando o crescimento da métrica principal do SaaS.
   - Popule com dados MÁXIMOS. Não deixe grandes espaços vazios. Preencha a tabela com 5-6 linhas reais. Preencha o feed com 4 eventos. Faça parecer um sistema corporativo de alto nível lotado de dados.

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
