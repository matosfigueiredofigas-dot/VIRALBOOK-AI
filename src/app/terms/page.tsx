export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <h1>Termos de Uso</h1>
        <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>

        <p>
          Bem-vindo ao ViralBook AI. Ao acessar nosso site e utilizar nossos serviços, você concorda com estes termos de uso.
          Por favor, leia cuidadosamente.
        </p>

        <h2>1. Uso da Plataforma</h2>
        <p>
          O ViralBook AI fornece acesso a ferramentas de pesquisa de mercado e geração de ideias baseadas em inteligência artificial.
          Você concorda em usar o serviço apenas para propósitos legais e em conformidade com todas as leis aplicáveis.
        </p>

        <h2>2. Propriedade Intelectual</h2>
        <p>
          As ideias de negócio (Lean Canvas) geradas pela Inteligência Artificial não possuem direitos autorais e podem ser utilizadas, 
          modificadas e monetizadas livremente pelo usuário. No entanto, o código-fonte, design, algoritmos e a marca "ViralBook AI" 
          são de nossa propriedade intelectual exclusiva.
        </p>

        <h2>3. Limitação de Responsabilidade</h2>
        <p>
          As ideias de SaaS e nichos fornecidas pela plataforma são geradas por Inteligência Artificial (Groq/LLMs) baseadas em 
          tendências públicas (Google Books). Não garantimos sucesso financeiro, vendas ou viabilidade de mercado. O risco e a 
          execução de qualquer ideia gerada são de inteira responsabilidade do usuário.
        </p>

        <h2>4. Reembolso (Garantia)</h2>
        <p>
          Oferecemos uma garantia incondicional de 7 dias. Se você não estiver satisfeito com a plataforma dentro deste período após a 
          compra, poderá solicitar um reembolso total entrando em contato pelo nosso e-mail de suporte.
        </p>

        <h2>5. Modificações dos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes termos a qualquer momento. Modificações entrarão em vigor imediatamente após a 
          publicação no site. Seu uso continuado da plataforma constituirá sua aceitação das mudanças.
        </p>

        <h2>6. Contato</h2>
        <p>
          Para dúvidas relacionadas a estes Termos de Uso, entre em contato através de: suporte@viralbook.ai
        </p>
      </div>
    </div>
  )
}
