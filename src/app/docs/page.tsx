export default function DocsPage() {
  return (
    <div className="space-y-20 pb-32">
      <section id="introducao" className="space-y-6 scroll-mt-24">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">O Manual Definitivo do ViralBook AI</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Bem-vindo à documentação oficial do ViralBook AI. Se você está aqui, você tomou a decisão de parar de adivinhar o que o mercado quer e começou a construir soluções baseadas em dados concretos, necessidades humanas reais e inteligência artificial de ponta. 
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O desenvolvimento tradicional de SaaS (Software as a Service) ensina que você deve ter uma ideia brilhante no chuveiro, gastar seis meses programando, investir milhares de reais em anúncios e, só então, descobrir se alguém realmente quer comprar aquilo. Nós construímos o ViralBook AI para destruir essa metodologia antiquada. O nosso processo inverte a lógica: primeiro nós encontramos a dor pela qual as pessoas já estão pagando em outras mídias (como livros físicos e e-books), e depois transformamos essa dor em um software.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Ao longo desta documentação, você entenderá profundamente não apenas "onde clicar", mas a engenharia mental e estratégica por trás de cada funcionalidade do sistema. Nós dissecamos o comportamento de compra humano e o conectamos com motores de Inteligência Artificial para gerar planos de negócios completos em segundos. 
        </p>
      </section>

      <div className="w-full h-px bg-border/50"></div>

      <section id="radar" className="space-y-6 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">1. Radar de Sinais (A Base de Dados do Google Books)</h2>
        
        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">A Filosofia da Dor Humana</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Por que livros? Esta é a primeira pergunta que as pessoas fazem. A resposta reside na psicologia da compra. As pessoas não compram livros (especialmente livros de não-ficção, autoajuda ou técnicos) porque querem ler; elas compram porque têm um problema tão agudo que estão dispostas a investir dinheiro e, mais importante, dezenas de horas do seu tempo na esperança de resolvê-lo. Se milhares de pessoas estão comprando livros sobre "Como organizar as finanças como freelancer", significa que existe uma dor monetizável aí. O software é apenas a evolução do livro: em vez de ensinar a pessoa a resolver, o software resolve por ela.
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Como a Busca Funciona Tecnicamente</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O nosso "Radar de E-books" se conecta diretamente aos servidores da API Oficial do Google Books. Esta não é uma busca genérica do Google; é uma busca indexada e otimizada pelo ISBN e catálogo de publicações mundiais. Quando você digita uma palavra-chave, o ViralBook faz uma requisição segura (utilizando a sua chave de API privada), filtrando os resultados para trazer os volumes mais relevantes e procurados. O algoritmo traz metadados preciosos: Título, Subtítulo (onde a dor geralmente se esconde), Autor, Sinopse completa e Categorias.
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">A Arte de Pesquisar (Engenharia de Prompt Humana)</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Para extrair o máximo do Radar, você precisa desaprender a buscar por "soluções" e começar a buscar por "sintomas". Se você buscar por "Software de Gestão", o algoritmo trará livros chatos de faculdade de administração, e o SaaS gerado será genérico e saturado. 
        </p>
        <div className="bg-muted/50 p-6 rounded-2xl border border-border mt-4">
          <h4 className="font-bold text-foreground mb-4 text-xl">✅ Exemplos de Buscas Ouro vs ❌ Buscas Saturadas</h4>
          <ul className="space-y-4 text-muted-foreground text-lg">
            <li><strong className="text-red-400">❌ Ruim:</strong> "Aplicativo de Dieta" (É a solução, e já está cheia de concorrência)</li>
            <li><strong className="text-emerald-400">✅ Ouro:</strong> "Fome Emocional" ou "Como parar de comer doces à noite" (É a dor real)</li>
            <li className="pt-2"><strong className="text-red-400">❌ Ruim:</strong> "Gestão de Tarefas"</li>
            <li><strong className="text-emerald-400">✅ Ouro:</strong> "TDAH para adultos" ou "Procrastinação no home office"</li>
            <li className="pt-2"><strong className="text-red-400">❌ Ruim:</strong> "Finanças"</li>
            <li><strong className="text-emerald-400">✅ Ouro:</strong> "Saindo das dívidas" ou "Divórcio e dinheiro"</li>
          </ul>
        </div>
        
        <p className="text-lg text-muted-foreground leading-relaxed mt-6">
          Ao pesquisar pela dor, os resultados da API do Google vão revelar livros incrivelmente nichados. Você verá a sinopse exata de como os autores tentam curar essa dor usando texto. É nesse momento que o cérebro do ViralBook AI entra em ação: ele vai ler a sinopse de um livro que ensina uma teoria e vai pensar "Como eu posso automatizar essa teoria transformando-a em um aplicativo prático?".
        </p>
      </section>

      <div className="w-full h-px bg-border/50"></div>

      <section id="oportunidades" className="space-y-6 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">2. Gerador de Oportunidades SaaS (Motor Groq)</h2>
        
        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">A Conexão Groq + IA Generativa</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Uma vez que você encontrou um livro interessante no Radar, você notará o botão "Transformar em Micro-SaaS". Este é o coração do sistema. Ao clicar, o ViralBook AI captura os metadados do livro e os empacota em um prompt altamente especializado. Esse pacote de dados é disparado para a LPU (Language Processing Unit) da Groq, utilizando os modelos open-source mais rápidos do mundo (como o Llama 3). 
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Nós escolhemos a Groq para essa arquitetura porque a velocidade de inferência (tokens por segundo) é astronômica. Em frações de segundo, a inteligência artificial absorve o contexto do livro, analisa as tendências de desenvolvimento web, mapeia a viabilidade econômica e cospe uma resposta formatada em JSON com um plano de negócios estruturado e um Lean Canvas completo.
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Decifrando as Métricas Geradas</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A IA não gera apenas uma ideia vaga; ela constrói uma arquitetura mental pronta para execução. Você precisa entender como ler o que ela gera:
        </p>

        <div className="space-y-6 mt-4">
          <div className="pl-6 border-l-4 border-primary/50">
            <h4 className="text-xl font-bold text-foreground">Score de Viralidade (Viral Opportunity Score)</h4>
            <p className="text-lg text-muted-foreground mt-2">
              Esta é uma pontuação de 0 a 100. A IA calcula a probabilidade de o software se vender sozinho por causa do seu alto "fator de compartilhamento" ou dor latente extrema. 
              <br/><br/>
              - <strong>80 a 100:</strong> Oceano Azul. Produto altamente visual ou que resolve uma dor tão urgente que os usuários imploraram por isso. Invista pesado.<br/>
              - <strong>50 a 79:</strong> Produto sólido, mas vai exigir esforço de marketing de conteúdo, SEO ou tráfego pago para tracionar.<br/>
              - <strong>Abaixo de 50:</strong> Cuidado. Geralmente nichos B2B complexos que exigem vendas enterprise demoradas e reuniões de zoom.
            </p>
          </div>

          <div className="pl-6 border-l-4 border-primary/50">
            <h4 className="text-xl font-bold text-foreground">Custo de Construção (Build Cost)</h4>
            <p className="text-lg text-muted-foreground mt-2">
              Como desenvolvedor ou empreendedor solo (Indie Hacker), seu tempo e caixa são limitados. 
              <br/><br/>
              - <strong>Baixo (Low):</strong> Pode ser construído com ferramentas No-Code (Bubble, FlutterFlow) ou scripts simples (Next.js + Vercel) em 1 a 2 fins de semana. Não requer treinar modelos complexos de IA ou integrações bancárias pesadas.<br/>
              - <strong>Médio (Medium):</strong> Exige integrações de API terceiras, um banco de dados relacional (Supabase/PostgreSQL) bem estruturado e possivelmente processamento em background (jobs). Tempo estimado: 1 a 3 meses.<br/>
              - <strong>Alto (High):</strong> Fuja disso se você for iniciante. Exige hardware proprietário, leis complexas (HIPAA, LGPD) ou criação de modelos massivos de IA do zero.
            </p>
          </div>

          <div className="pl-6 border-l-4 border-primary/50">
            <h4 className="text-xl font-bold text-foreground">O Lean Canvas (Modelo de Negócios enxuto)</h4>
            <p className="text-lg text-muted-foreground mt-2">
              A inteligência artificial estrutura nove blocos fundamentais para você não se perder: <em>Problema, Solução, Proposta de Valor, Vantagem Injusta, Segmentos de Cliente, Métricas Chave, Canais de Distribuição, Estrutura de Custos e Fluxo de Receita.</em>
              A Vantagem Injusta (Unfair Advantage) é talvez o bloco mais vital que a IA vai te dar. Se a vantagem apontada for "somos mais baratos", descarte a ideia. O ViralBook vai te sugerir vantagens como "Processamento proprietário de áudio para ansiedade" ou "Efeito de rede fechado para nicho X".
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-border/50"></div>

      <section id="favoritos" className="space-y-6 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">3. O Cofre de Nichos (Favoritos e Banco de Dados)</h2>
        
        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Persistência e Arquitetura Supabase</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          No mundo das ideias, a pior coisa que pode acontecer é você gerar o próximo unicórnio na tela do seu computador, fechar a aba sem querer, e perder a ideia para sempre. É por isso que criamos um ecossistema persistente apoiado pelo Supabase (o gigante banco de dados relacional baseado em PostgreSQL).
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Quando a IA (Groq) cospe o resultado formatado no Dashboard, ele é lindo, mas ainda é volátil (está na memória RAM do seu navegador). No momento em que você clica no ícone de <strong>Coração (🤍)</strong>, uma engrenagem de backend é acionada: o sistema formata o JSON da IA, limpa os campos para as tipagens do banco de dados e executa uma query de inserção (INSERT) nas tabelas relacionais (`opportunities` e `user_favorites`).
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Autenticação Segura (Google OAuth)</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O Cofre de Nichos é altamente pessoal. Você não quer que seus concorrentes vejam quais nichos você está estudando. Para garantir proteção em nível empresarial, integramos o Supabase Auth com o protocolo OAuth do Google. 
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A rota protegida da página de Favoritos (`/favorites`) executa uma verificação Sever-Side Rendering (SSR). Isso significa que a verificação de segurança ocorre dentro do servidor, antes mesmo de a tela ser enviada para o seu navegador. Se um usuário anônimo tentar acessar a URL digitando-a diretamente no navegador, o servidor do Next.js intercepta a requisição, nega o acesso ao banco de dados e dispara um redirecionamento forçado (Redirect 301) para a página de Login. Seus dados estão criptografados e atrelados unicamente ao seu Session ID (Token JWT).
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Organização e Filtros Avançados</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Conforme você usa o Radar diariamente, é normal acumular 50, 100, 200 ideias no seu cofre. Navegar por isso manualmente se tornaria caótico. A aba de Favoritos não é apenas uma "lista", é um painel de gerenciamento.
          Implementamos uma camada de filtros em tempo real. Você pode:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-lg mt-4">
          <li><strong>Busca Semântica:</strong> Digitar palavras-chave que pesquisam não apenas no título do SaaS, mas também na categoria do livro original e na descrição do problema resolvido.</li>
          <li><strong>Filtro de Qualidade:</strong> O controle deslizante (Slider) permite que você oculte projetos medianos. Se você tem 100 ideias salvas, basta arrastar o slider de "Score de Viralidade Mínimo" para 85, e a tela piscará, mostrando apenas as pepitas de ouro (top 5% das suas ideias).</li>
        </ul>
        
        <p className="text-lg text-muted-foreground leading-relaxed mt-6">
          A união dessas três funcionalidades (Busca em Livros + Geração por LPU/Groq + Cofre Seguro no Supabase) é o que torna o ViralBook AI uma máquina implacável. Você não está mais limitado pela sua criatividade; você se tornou um caçador munido de algoritmos.
        </p>
      </section>

      <div className="w-full h-px bg-border/50"></div>

      <section id="escala-e-facebook" className="space-y-6 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">4. Validação do Facebook, Biblioteca de Reutilização e Escala</h2>
        
        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Validação Ampliada com Facebook Ads e Grupos</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Para enriquecer os sinais de demanda comercial do mercado, estendemos o motor de varredura de validação social para incluir métricas inteligentes do Facebook (Ads Library e Facebook Groups). 
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Diferente do Reddit, o Facebook não possui endpoints JSON públicos e simples. Criamos um agente inteligente que analisa o nicho e gera estimativas de saturação de campanhas de anúncios ativos e quantidade de grupos de discussão. Esses dados ajudam a identificar se o mercado já compra soluções (anúncios ativos) e onde seu público-alvo se reúne (grupos), facilitando sua estratégia de aquisição orgânica de clientes.
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">A Biblioteca de Reutilização (Histórico)</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Adicionamos uma aba de <strong>Histórico & Biblioteca</strong> em `/library`. Ela funciona como uma estante virtual de livros que permite visualizar e reutilizar todas as análises de e-books e ideias de SaaS pré-calculadas e salvas no banco de dados.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Com a nossa camada de <strong>cache de 7 dias</strong>, buscas por termos repetidos carregam instantaneamente a partir do banco de dados, sem realizar novas chamadas para as APIs e IA externas, protegendo e economizando seus créditos.
        </p>

        <h3 className="text-2xl font-semibold mt-8 text-foreground/90">Proteções de Escopo e Performance (100.000+ Registros)</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Para garantir a integridade da aplicação em produção e suportar dezenas de milhares de usuários ativos sem explosão de custos:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-lg mt-4">
          <li><strong>Rate Limiting no Servidor:</strong> Cada usuário autenticado tem um limite de até <strong>10 pesquisas de radar a cada 24 horas</strong>. O Next.js gerencia esse controle de forma limpa através de consultas no próprio banco de dados, retornando o status HTTP 429 quando excedido.</li>
          <li><strong>Resiliência de IA (Failover):</strong> Caso o Groq atinja limites de requisições por minuto (RPM) ou cota de tokens, o sistema detecta a falha e redireciona automaticamente para a API da OpenAI (modelo <code>gpt-4o-mini</code>) se uma chave estiver configurada no ambiente.</li>
          <li><strong>Otimização de Índices (Postgres):</strong> Foram aplicados índices B-Tree nas colunas de busca (país, data de criação e ID do usuário) e índices <strong>GIN baseados em trigramas (pg_trgm)</strong> nas colunas de texto <code>saas_name</code> e <code>problem_solved</code>, mantendo buscas por texto rápidas e responsivas mesmo com mais de 100 mil registros no banco.</li>
        </ul>
      </section>
    </div>
  );
}
