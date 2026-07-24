"use client";

import { useLanguage } from "@/contexts/language-context";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <h1>{isEn ? "Privacy Policy" : isEs ? "Política de Privacidad" : "Política de Privacidade"}</h1>
        <p><strong>{isEn ? "Last updated:" : isEs ? "Última actualización:" : "Última atualização:"} {new Date().toLocaleDateString(isEn ? 'en-US' : isEs ? 'es-ES' : 'pt-BR')}</strong></p>

        <p>
          {isEn 
            ? "Your privacy is critically important to us at ViralBook AI. This policy outlines what data we collect, how we use it, and how we keep it secure." 
            : isEs 
            ? "Su privacidad es muy importante para nosotros en ViralBook AI. Esta política describe qué datos recopilamos, cómo los usamos y cómo los mantenemos seguros." 
            : "Sua privacidade é criticamente importante para nós no ViralBook AI. Esta política descreve quais dados coletamos, como os utilizamos e como os mantemos seguros."}
        </p>

        <h2>{isEn ? "1. Information Collection" : isEs ? "1. Recopilación de Información" : "1. Coleta de Informações"}</h2>
        <p>
          <strong>{isEn ? "Account Data:" : isEs ? "Datos de Cuenta:" : "Dados de Conta:"}</strong> {isEn 
            ? "When registering, we collect your email address and public name to create and authenticate your account in our database (Supabase)." 
            : isEs 
            ? "Al registrarse, recopilamos su correo electrónico y nombre público para crear y autenticar su cuenta en nuestra base de datos (Supabase)." 
            : "Ao se registrar, coletamos seu endereço de e-mail e nome público para criar e autenticar sua conta em nosso banco de dados (Supabase)."}
        </p>
        <p>
          <strong>{isEn ? "Usage Data:" : isEs ? "Datos de Uso:" : "Dados de Uso:"}</strong> {isEn 
            ? "We save in the database the projects (Favorites) you choose to store in your vault. This information is strictly tied to your user ID." 
            : isEs 
            ? "Guardamos en la base de datos los proyectos (Favoritos) que elige guardar en su bóveda. Esta información está estrictamente vinculada a su ID de usuario." 
            : "Salvamos no banco de dados os projetos (Favoritos) que você escolhe guardar no seu cofre. Estas informações são estritamente atreladas ao seu ID de usuário."}
        </p>

        <h2>{isEn ? "2. Use of Information" : isEs ? "2. Uso de la Información" : "2. Uso das Informações"}</h2>
        <p>{isEn ? "We use collected data to:" : isEs ? "Usamos los datos recopilados para:" : "Utilizamos os dados coletados para:"}</p>
        <ul>
          <li>{isEn ? "Provide and maintain the service (e.g. authenticate login and display favorites)." : isEs ? "Proporcionar y mantener el servicio (ej. autenticar su inicio de sesión)." : "Fornecer e manter o serviço (ex: autenticar seu login e mostrar seus favoritos)."}</li>
          <li>{isEn ? "Notify you about important platform or account updates." : isEs ? "Notificarle sobre actualizaciones importantes de la plataforma o cuenta." : "Notificá-lo sobre atualizações importantes da plataforma ou da sua conta."}</li>
          <li>{isEn ? "Ensure security and prevent unauthorized access." : isEs ? "Garantizar la seguridad y prevenir accesos no autorizados." : "Garantir a segurança e prevenir acessos não autorizados."}</li>
        </ul>

        <h2>{isEn ? "3. Data Protection (The Vault)" : isEs ? "3. Protección de Datos (La Bóveda)" : "3. Proteção de Dados (O Cofre)"}</h2>
        <p>
          {isEn 
            ? "Your saved ideas are personal and confidential. We use Row Level Security (RLS) at the database level to ensure no other user can access or modify your Favorites." 
            : isEs 
            ? "Sus ideas guardadas son personales y confidenciales. Usamos Row Level Security (RLS) en la base de datos para garantizar que nadie más acceda a sus Favoritos." 
            : "Suas ideias salvas são pessoais e confidenciais. Utilizamos RLS (Row Level Security) no nível do banco de dados para garantir que nenhum outro usuário consiga visualizar seus Favoritos."}
        </p>

        <h2>{isEn ? "4. Data Sharing" : isEs ? "4. Compartición de Datos" : "4. Compartilhamento de Dados"}</h2>
        <p>
          {isEn 
            ? "We do not sell, rent, or share your personal data or project ideas with third parties." 
            : isEs 
            ? "No vendemos, alquilamos ni compartimos sus datos personales o ideas de proyectos con terceros." 
            : "Nós não vendemos, alugamos ou repassamos seus dados pessoais ou suas ideias de projetos para terceiros."}
        </p>

        <h2>{isEn ? "5. Your Rights" : isEs ? "5. Sus Derechos" : "5. Seus Direitos"}</h2>
        <p>
          {isEn 
            ? "You have the right to request complete deletion of your account and all associated data at any time by contacting support." 
            : isEs 
            ? "Tiene derecho a solicitar la eliminación completa de su cuenta y todos los datos asociados en cualquier momento contactando con soporte." 
            : "Você tem o direito de solicitar a exclusão completa da sua conta e de todos os dados associados a ela a qualquer momento. Basta entrar em contato com o suporte."}
        </p>

        <h2>{isEn ? "6. Contact" : isEs ? "6. Contacto" : "6. Contato"}</h2>
        <p>
          {isEn 
            ? "If you have questions regarding this Privacy Policy, contact us at: suporte@viralbook.ai" 
            : isEs 
            ? "Si tiene preguntas sobre esta Política de Privacidad, contáctenos en: suporte@viralbook.ai" 
            : "Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato através de: suporte@viralbook.ai"}
        </p>
      </div>
    </div>
  );
}
