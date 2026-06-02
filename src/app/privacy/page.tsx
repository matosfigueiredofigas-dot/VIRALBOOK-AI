export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <h1>Política de Privacidade</h1>
        <p><strong>Última atualização: {new Date().toLocaleDateString('pt-BR')}</strong></p>

        <p>
          Sua privacidade é criticamente importante para nós no ViralBook AI. 
          Esta política descreve quais dados coletamos, como os utilizamos e como os mantemos seguros.
        </p>

        <h2>1. Coleta de Informações</h2>
        <p>
          <strong>Dados de Conta:</strong> Ao se registrar através do Google, coletamos seu endereço de e-mail e nome público para 
          criar e autenticar sua conta em nosso banco de dados (Supabase).
        </p>
        <p>
          <strong>Dados de Uso:</strong> Salvemos no banco de dados os projetos (Favoritos) que você escolhe guardar no seu cofre. 
          Estas informações são estritamente atreladas ao seu ID de usuário.
        </p>

        <h2>2. Uso das Informações</h2>
        <p>Utilizamos os dados coletados para:</p>
        <ul>
          <li>Fornecer e manter o serviço (ex: autenticar seu login e mostrar seus favoritos).</li>
          <li>Notificá-lo sobre atualizações importantes da plataforma ou da sua conta.</li>
          <li>Garantir a segurança e prevenir acessos não autorizados.</li>
        </ul>

        <h2>3. Proteção de Dados (O Cofre)</h2>
        <p>
          Suas ideias salvas são pessoais e confidenciais. Utilizamos RLS (Row Level Security) no nível do banco de dados 
          para garantir que nenhum outro usuário, além de você, consiga visualizar, acessar ou modificar seus Favoritos.
        </p>

        <h2>4. Compartilhamento de Dados</h2>
        <p>
          Nós não vendemos, alugamos ou repassamos seus dados pessoais ou suas ideias de projetos para terceiros. 
          Podemos compartilhar dados anonimizados de uso geral para melhorar os algoritmos da plataforma.
        </p>

        <h2>5. Seus Direitos</h2>
        <p>
          Você tem o direito de solicitar a exclusão completa da sua conta e de todos os dados associados a ela (incluindo seus favoritos) 
          a qualquer momento. Basta entrar em contato com o nosso suporte.
        </p>

        <h2>6. Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato através de: suporte@viralbook.ai
        </p>
      </div>
    </div>
  )
}
