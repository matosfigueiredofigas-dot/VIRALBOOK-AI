"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Users, Target, Cpu, Banknote, Copy, CheckCircle2, Star, Loader2, Zap, Globe, Bookmark, Trash2, FolderHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item, audiences, problems, technologies, monetizations } from "@/lib/matrices";
import { supabase } from "@/lib/supabase";

const staticAudienceCategories: Record<string, string> = {
  "Restaurantes Locais": "alimentacao",
  "Personal Trainers": "saude_esportes",
  "Pousadas e Hostels": "turismo",
  "Motoristas de Aplicativo": "b2b_geral",
  "Manicures e Salões de Beleza": "moda",
  "Vendedores de E-commerce": "b2b_geral",
  "Padeiros Artesanais": "alimentacao",
  "Floriculturas": "b2b_geral",
  "Pet Walkers": "b2b_geral",
  "Fotógrafos de Casamento": "b2b_geral",
  "Bares e Lanchonetes": "alimentacao",
  "Entregadores": "b2b_geral",
  "Professores Particulares": "b2b_geral",
  "Costureiras": "b2b_geral",
  "Padarias": "alimentacao",
  "Mercadinhos de Bairro": "b2b_geral",
  "Lava-Rápidos": "b2b_geral",
  "Academias de Musculação": "saude_esportes",
  "Pet Shops": "b2b_geral",
  "Lojas de Roupas": "b2b_geral",
  "Autoescolas": "b2b_geral",
  "Farmácias de Bairro": "saude_esportes",
  "Barbearias": "moda",
  "Vidraçarias": "b2b_geral",
  "Serralherias": "b2b_geral",
  "Pintores e Pedreiros": "b2b_geral",
  "Corretores de Imóveis": "b2b_geral",
  "Advogados Autônomos": "carreiras",
  "Empresas de Limpeza": "b2b_geral",
  "Guias Turísticos": "turismo",
  "Encanadores e Eletricistas": "b2b_geral",
  "Borracharias": "b2b_geral",
  "Gráficas e Copiadoras": "b2b_geral",
  "Lojas de Suplementos": "saude_esportes",
  "Auto Peças": "b2b_geral",
  "Distribuidoras de Bebidas": "alimentacao",
  "Transportadoras Locais": "b2b_geral",
  "Oficinas de Costura": "moda",
  "Agências de Turismo": "turismo",
  "Concessionárias de Seminovos": "b2b_geral",
  "Casas de Festas": "b2b_geral",
  "Buffets Infantis": "b2b_geral",
  "Empreiteiras": "b2b_geral",
  "Clínicas Odontológicas Populares": "saude_esportes",
  "Despachantes": "b2b_geral",
  "Escolas de Trânsito": "b2b_geral",
  "Estúdios Fotográficos": "b2b_geral",
  "Clínicas de Fisioterapia": "saude_esportes",
  "Agências de Intercâmbio": "turismo",
  "Nutricionistas Esportivos": "saude_esportes",
  "Escolas de Idiomas Bilingues": "b2b_geral",
  "Arquitetos": "b2b_geral",
  "Contadores": "carreiras",
  "Consultores Financeiros": "carreiras",
  "Produtores de Cerveja Artesanal": "alimentacao",
  "Coworkings e Espaços Compartilhados": "b2b_geral",
  "Escritórios de Engenharia": "b2b_geral",
  "Oficinas de Funilaria Premium": "b2b_geral",
  "Produtores de Alimentos Orgânicos": "alimentacao",
  "Consultores de RH": "carreiras",
  "Síndicos Profissionais": "b2b_geral",
  "Clínicas de Estética Avançada": "moda",
  "Escolas de Música e Artes": "familia",
  "Assessorias de Imprensa": "b2b_geral",
  "Corretoras de Seguros": "carreiras",
  "Escritórios de Design de Interiores": "carreiras",
  "Psicólogos Clínicos": "saude_esportes",
  "Terapeutas Holísticos": "saude_esportes",
  "Clínicas de Acupuntura": "saude_esportes",
  "Acampamentos de Férias": "b2b_geral",
  "Galerias de Arte Locais": "b2b_geral",
  "Especialistas em Implantes Dentários": "b2b_geral",
  "Clínicas de Cirurgia Plástica": "saude_esportes",
  "Fábricas de Software Bootstrapped": "carreiras",
  "Agências de Viagem de Luxo": "turismo",
  "Hospitais Veterinários 24h": "saude_esportes",
  "Construtoras de Alto Padrão": "b2b_geral",
  "Joalherias Customizadas": "moda",
  "Estúdios de Yoga e Mindfulness": "saude_esportes",
  "Produtoras Audiovisuais e de Cinema": "b2b_geral",
  "Hospitais e Maternidades Particulares": "familia",
  "Gestores de Patrimônio (Family Offices)": "carreiras",
  "Concessionárias de Veículos de Luxo": "b2b_geral",
  "Consultorias Tributárias Especializadas": "carreiras",
  "Clínicas de Dermatologia Estética": "saude_esportes",
  "Escritórios de Advocacia Corporativa": "b2b_geral",
  "Importadoras de Vinhos Premium": "alimentacao",
  "Clubes de Golfe e Tiro": "saude_esportes",
  "Clínicas de Reprodução Humana": "familia",
  "Criadores de Conteúdo (Influencers)": "b2b_geral",
  "Agências de Marketing de Performance": "carreiras",
  "Produtores de Festivais de Música": "musica",
  "Youtubers e Streamers Profissionais": "b2b_geral",
  "Infoprodutores High-Ticket": "b2b_geral",
  "Startups em Early Stage": "carreiras",
  "Redes de Podcasts": "musica",
  "Agências de Lançamento de Infoprodutos": "b2b_geral",
  "Consultores de Inteligência Artificial": "carreiras",
  "E-commerces DNVB (Direct-to-Consumer)": "b2b_geral",
  "Especialistas em SEO e Growth Hacking": "carreiras",
  "Gestores de Comunidades Onlines": "b2b_geral",
  "Copywriters de Resposta Direta": "carreiras",
  "Editores de Vídeo de Alta Retenção": "b2b_geral",
  "Plataformas de SaaS B2B Básico": "b2b_geral",
  "Fintechs em Estágio de Crescimento": "carreiras",
  "EdTechs (Plataformas Educacionais)": "carreiras",
  "Clínicas Psiquiátricas com Psicodélicos": "saude_esportes",
  "Estúdios de Tatuagem Realista": "moda",
  "Mecânicos Especializados em Porsches": "b2b_geral",
  "Criadores de Gado de Elite": "b2b_geral",
  "Mergulhadores Profissionais de Alto Mar": "turismo",
  "Produtores de Cogumelos Exóticos": "alimentacao",
  "Estúdios de Animação 3D para Games": "b2b_geral",
  "Empresas de Instalação de Energia Solar": "meio_ambiente",
  "Fabricantes de Drones Agrícolas": "b2b_geral",
  "Laboratórios de Genética Pessoal": "saude_esportes",
  "Cervejarias Ciganas (Sem Fábrica)": "alimentacao",
  "Apicultores de Mel Medicinal": "alimentacao",
  "Fazendas de Mineração de Criptomoedas": "carreiras",
  "Empresas de Desinfecção Hospitalar": "saude_esportes",
  "Laboratórios de Biotecnologia": "saude_esportes",
  "Restauradores de Obras de Arte Clássicas": "b2b_geral",
  "Investigadores Particulares Cibernéticos": "b2b_geral",
  "Produtores de Cannabis Medicinal Legalizada": "saude_esportes",
  "Criadores de Avestruz e Carnes Exóticas": "alimentacao",
  "Operadores de Usinas Eólicas": "meio_ambiente",
  "Cultivadores de Trufas Brancas": "alimentacao",
  "Pilotos de Balão Turístico": "turismo"
};

const staticProblemCategories: Record<string, string> = {
  "Criação de Conteúdo para Redes": "b2b_geral",
  "Organização de Estoque Físico": "b2b_geral",
  "Controle de Ponto de Funcionários": "b2b_geral",
  "Emissão de Recibos em Papel": "b2b_geral",
  "Agendamento Manual via Telefone": "b2b_geral",
  "Perda de Clientes Frequentes": "b2b_geral",
  "Dificuldade de Controle de Caixa Diário": "b2b_geral",
  "Fila de Espera Demorada e Desorganizada": "b2b_geral",
  "Falta de Orçamentos Claros para o Cliente": "b2b_geral",
  "Controle de 'Fiados' e Cadernetas": "b2b_geral",
  "Má Gestão de Entregas (Delivery)": "b2b_geral",
  "Agendamento e No-Shows (Faltas)": "b2b_geral",
  "Gestão Financeira e Cobranças de Boletos": "b2b_geral",
  "Emissão de Notas Fiscais Eletrônicas": "b2b_geral",
  "Atraso Constante em Pagamentos Mensais": "b2b_geral",
  "Gestão de Frota de Veículos": "b2b_geral",
  "Falta de Histórico Unificado de Clientes": "b2b_geral",
  "Dificuldade em Delegar Tarefas Simples": "b2b_geral",
  "Compras de Insumos Desorganizadas": "b2b_geral",
  "Cotação Lenta com Múltiplos Fornecedores": "b2b_geral",
  "Acompanhamento Cego de Pedidos": "b2b_geral",
  "Logística Reversa e Gestão de Devoluções": "b2b_geral",
  "Recrutamento e Seleção de Talentos Base": "carreiras",
  "Otimização de SEO Local (Google Maps)": "b2b_geral",
  "Treinamento de Equipe Operacional": "b2b_geral",
  "Organização de Documentos na Nuvem": "b2b_geral",
  "Gestão de Tarefas Complexas em Equipe": "b2b_geral",
  "Controle de Prazos de Entregas B2B": "b2b_geral",
  "Conformidade Trabalhista e Ponto Digital": "b2b_geral",
  "Criação Rápida de Propostas Comerciais Visuais": "b2b_geral",
  "Onboarding Confuso de Novos Funcionários": "b2b_geral",
  "Retenção de Clientes Premium VIPs": "b2b_geral",
  "Gestão de Contratos e Assinaturas Digitais": "b2b_geral",
  "Coleta Automática de Feedbacks e Avaliações": "b2b_geral",
  "Controle de Garantias de Produtos Caros": "b2b_geral",
  "Previsão de Demanda de Estoque para o Trimestre": "b2b_geral",
  "Cálculo Preciso de Margem de Lucro por Projeto": "b2b_geral",
  "Automação de Marketing B2B Omnichannel": "b2b_geral",
  "Integração Pobre com Sistemas Legados Antigos": "b2b_geral",
  "Gestão de Riscos Operacionais em Escala": "b2b_geral",
  "Compliance Fiscal e Tributário Dinâmico": "b2b_geral",
  "Aquisição Cara de Leads Frios via Anúncios": "b2b_geral",
  "Baixo Engajamento e Cultura de Funcionários Remotos": "b2b_geral",
  "Onboarding Dinâmico e Gamificado de Clientes": "b2b_geral",
  "Personalização em Massa de Emails (Cold Emailing)": "b2b_geral",
  "Automação Inteligente de Funil de Vendas": "carreiras",
  "Monitoramento Cego de Métricas SaaS (LTV/CAC)": "b2b_geral",
  "Gestão Descentralizada de Afiliados e Parceiros": "b2b_geral",
  "Otimização Contínua de Conversão (CRO) de LPs": "b2b_geral",
  "Segmentação de Audiência Super Avançada": "b2b_geral",
  "Qualificação Automática de Leads via Comportamento": "b2b_geral",
  "Prevenção Avançada de Fraudes com Cartão Clonado": "b2b_geral",
  "Monitoramento Deep Web de Reputação Online": "b2b_geral",
  "Tradução e Localização Contextual em Tempo Real": "b2b_geral",
  "Logística e Otimização de Rotas de Múltiplos Veículos": "b2b_geral",
  "Automação de Respostas de Suporte de Alta Complexidade": "b2b_geral",
  "Rastreio Global de Ativos Extremamente Valiosos": "b2b_geral",
  "Análise Preditiva de Churn (Cancelamento) de Contas Key": "b2b_geral",
  "Detecção de Anomalias Financeiras e Lavagem de Dinheiro": "b2b_geral",
  "Simulação de Cenários de Crise em Realidade Virtual": "b2b_geral",
  "Auditoria Imutável de Contratos e Acordos em Blockchain": "b2b_geral",
  "Gestão Automatizada de Créditos de Carbono ESG": "meio_ambiente",
  "Desafio de acordar cedo": "saude_esportes",
  "Clube dos 30 dias": "saude_esportes",
  "Construção de hábitos": "saude_esportes",
  "Desafio sem procrastinação": "saude_esportes",
  "Metas compartilhadas": "saude_esportes",
  "Diário de evolução": "saude_esportes",
  "Ranking de disciplina": "saude_esportes",
  "Coach de hábitos por IA": "saude_esportes",
  "Competição de produtividade": "b2b_geral",
  "Planejador de vida": "b2b_geral",
  "Missões de autodesenvolvimento": "b2b_geral",
  "Desafio sem redes sociais": "b2b_geral",
  "Clube da leitura diária": "b2b_geral",
  "Diário de gratidão": "saude_esportes",
  "Desafio de foco": "saude_esportes",
  "Sistema de recompensas pessoais": "saude_esportes",
  "Academia mental": "saude_esportes",
  "Clube dos vencedores": "saude_esportes",
  "Missões de coragem": "saude_esportes",
  "Evolução pessoal gamificada": "saude_esportes",
  "Networking local": "carreiras",
  "Desafios de habilidades profissionais": "carreiras",
  "Simulador de entrevistas com IA": "carreiras",
  "Ranking de freelancers": "carreiras",
  "Banco de talentos": "carreiras",
  "Missões para carreira": "carreiras",
  "Clube de empreendedores": "carreiras",
  "Comunidade de startups": "carreiras",
  "Mentor IA": "carreiras",
  "Aprender vendas": "carreiras",
  "Aprender negociação": "carreiras",
  "Comunidade de programadores": "carreiras",
  "Batalha de currículos": "carreiras",
  "Construção de portfólio": "carreiras",
  "Avaliação profissional": "b2b_geral",
  "Clube de líderes": "carreiras",
  "Marketplace de conhecimento": "b2b_geral",
  "Coaching profissional": "carreiras",
  "Carreira internacional": "carreiras",
  "Ranking de especialistas": "carreiras",
  "Caça a lugares secretos": "turismo",
  "Desafios de viagem": "turismo",
  "Passaporte digital de viagens": "turismo",
  "Ranking de exploradores": "turismo",
  "Diário de viagens": "turismo",
  "Turismo colaborativo": "turismo",
  "Descubra sua cidade": "turismo",
  "Turismo gastronômico": "turismo",
  "Aventuras locais": "turismo",
  "Guia feito pelos usuários": "turismo",
  "Check-in gamificado": "turismo",
  "Competição entre viajantes": "turismo",
  "Viagens econômicas": "turismo",
  "Mochileiros conectados": "turismo",
  "Turismo histórico": "turismo",
  "Trilhas compartilhadas": "turismo",
  "Fotos de lugares raros": "turismo",
  "Ranking de destinos": "turismo",
  "Viagens em grupo": "turismo",
  "Mapa de experiências": "turismo",
  "Receitas em vídeo": "alimentacao",
  "Desafio culinário diário": "alimentacao",
  "Batalha de cozinheiros": "alimentacao",
  "Comunidade vegana": "alimentacao",
  "Ranking de receitas": "alimentacao",
  "Pratos criados por IA": "alimentacao",
  "Cardápio inteligente": "alimentacao",
  "Refeições econômicas": "alimentacao",
  "Desafio de alimentação saudável": "alimentacao",
  "Planejador alimentar": "alimentacao",
  "Comunidade fitness culinária": "alimentacao",
  "Receitas de família": "alimentacao",
  "Comida internacional": "alimentacao",
  "Clube dos chefs": "alimentacao",
  "Receitas rápidas": "alimentacao",
  "Troca de receitas": "alimentacao",
  "Concurso gastronômico": "alimentacao",
  "Ranking de restaurantes": "alimentacao",
  "Marmitas inteligentes": "alimentacao",
  "Cozinha colaborativa": "alimentacao",
  "Jogos educativos familiares": "familia",
  "Atividades para crianças": "familia",
  "Histórias infantis com IA": "familia",
  "Clube da família": "familia",
  "Missões familiares": "familia",
  "Aprendizagem divertida": "familia",
  "Planejador familiar": "familia",
  "Desafios entre pais e filhos": "familia",
  "Diário da família": "familia",
  "Rede de pais": "familia",
  "Comunidade escolar": "familia",
  "Educação gamificada": "familia",
  "Recompensas infantis": "familia",
  "Aventuras educativas": "turismo",
  "Clube dos pequenos leitores": "familia",
  "Matemática infantil": "familia",
  "Desafios criativos infantis": "familia",
  "Histórias colaborativas": "familia",
  "Clube de talentos infantis": "familia",
  "Aprender brincando": "familia",
  "Batalha de cantores": "musica",
  "Karaokê competitivo": "musica",
  "Liga de músicos": "musica",
  "Criador de músicas IA": "musica",
  "Letras colaborativas": "musica",
  "Concurso de composição": "musica",
  "Ranking musical": "musica",
  "Descoberta de talentos": "carreiras",
  "Banda virtual": "musica",
  "Jam sessions online": "musica",
  "Comunidade de DJs": "musica",
  "Treino vocal": "musica",
  "Desafios musicais": "musica",
  "Remix colaborativo": "musica",
  "Aprender instrumentos": "musica",
  "Clube de compositores": "musica",
  "Produção musical social": "musica",
  "Música por localização": "musica",
  "Ranking de artistas locais": "musica",
  "Festival virtual": "musica",
  "Liga de futebol amador": "saude_esportes",
  "Ranking de jogadores locais": "saude_esportes",
  "Comunidade de corrida": "saude_esportes",
  "Desafios esportivos": "saude_esportes",
  "Clube de ciclismo": "saude_esportes",
  "Torneios comunitários": "saude_esportes",
  "Futebol entre amigos": "saude_esportes",
  "Basquete local": "saude_esportes",
  "Treinos esportivos": "saude_esportes",
  "Scout de talentos": "saude_esportes",
  "Estatísticas pessoais": "b2b_geral",
  "Fantasy esportivo local": "saude_esportes",
  "Clube de atletas": "saude_esportes",
  "Missões esportivas": "saude_esportes",
  "Ranking regional": "b2b_geral",
  "Comunidade de esportes radicais": "saude_esportes",
  "Desafios de resistência": "saude_esportes",
  "Eventos esportivos": "saude_esportes",
  "Equipes por bairro": "b2b_geral",
  "Jogos recreativos": "b2b_geral",
  "Consultor de estilo IA": "moda",
  "Avaliação de looks": "moda",
  "Comunidade fashion": "moda",
  "Desafio de moda": "moda",
  "Troca de roupas": "moda",
  "Ranking de estilo": "moda",
  "Looks do dia": "moda",
  "Armário digital": "moda",
  "Moda sustentável": "meio_ambiente",
  "Tendências locais": "b2b_geral",
  "Beleza colaborativa": "moda",
  "Dicas de maquiagem": "moda",
  "Simulador de cortes de cabelo": "moda",
  "Estilo masculino": "moda",
  "Estilo feminino": "moda",
  "Moda para eventos": "moda",
  "Concurso fashion": "moda",
  "Comunidade de influenciadores": "b2b_geral",
  "Personal shopper IA": "moda",
  "Fashion battle": "moda",
  "Desafios ecológicos": "meio_ambiente",
  "Plantio colaborativo": "meio_ambiente",
  "Comunidade verde": "meio_ambiente",
  "Reciclagem gamificada": "meio_ambiente",
  "Ranking ecológico": "meio_ambiente",
  "Missões sustentáveis": "meio_ambiente",
  "Limpeza comunitária": "meio_ambiente",
  "Redução de carbono": "meio_ambiente",
  "Clube ambiental": "meio_ambiente",
  "Monitor de consumo": "meio_ambiente",
  "Horta coletiva": "meio_ambiente",
  "Sustentabilidade doméstica": "meio_ambiente",
  "Economia circular": "meio_ambiente",
  "Troca sustentável": "meio_ambiente",
  "Educação ambiental": "meio_ambiente",
  "Voluntariado verde": "meio_ambiente",
  "Eventos ecológicos": "meio_ambiente",
  "Concurso ambiental": "meio_ambiente",
  "Comunidade de recicladores": "meio_ambiente",
  "Impacto positivo": "meio_ambiente",
  "Reality show entre usuários": "b2b_geral",
  "Competição de inteligência": "b2b_geral",
  "Simulador de fama": "b2b_geral",
  "Missões secretas": "b2b_geral",
  "Rede de desafios globais": "b2b_geral",
  "Campeonato de criatividade": "b2b_geral",
  "Liga de solucionadores de problemas": "b2b_geral",
  "Rede de inventores": "b2b_geral",
  "Banco de ideias": "b2b_geral",
  "Construção coletiva de projetos": "b2b_geral",
  "IA para prever tendências": "b2b_geral",
  "Clube dos curiosos": "b2b_geral",
  "Caça a oportunidades": "b2b_geral",
  "Ranking de inovação": "b2b_geral",
  "Rede de descobertas": "b2b_geral",
  "Competição de startups": "carreiras",
  "Comunidade de visionários": "b2b_geral",
  "Missões empresariais": "carreiras",
  "Liga dos criadores": "b2b_geral",
  "Ecossistema global de desafios": "b2b_geral",
  "Top 20 mais promissoras entre as 400 ideias": "b2b_geral",
  "Rede social de desafios IA": "b2b_geral",
  "Reality show digital": "b2b_geral",
  "Competições de criatividade": "b2b_geral",
  "Aprendizagem gamificada de idiomas": "familia",
  "Fitness com rankings sociais": "saude_esportes",
  "Marketplace hiperlocal": "b2b_geral",
  "Banco de ideias monetizáveis": "b2b_geral",
  "Clube dos empreendedores": "carreiras",
  "Detector de tendências": "b2b_geral",
  "Campeonato global de habilidades": "carreiras",
  "Ecossistema de missões e recompensas": "saude_esportes"
};

const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function getAudienceCategory(name: string): string {
  const staticCat = staticAudienceCategories[name];
  if (staticCat) return staticCat;

  const n = normalize(name);
  
  if (n.includes("barbearia") || n.includes("barbeir")) {
    return "moda";
  }
  if (n.includes("autoescola") || n.includes("transito") || n.includes("idiomas")) {
    return "b2b_geral";
  }
  if (n.includes("turis") || n.includes("viag") || n.includes("viaj") || n.includes("explor") || n.includes("pousada") || n.includes("hostel") || n.includes("balao") || n.includes("guia") || n.includes("intercambio") || n.includes("mergulhador")) {
    return "turismo";
  }
  if (n.includes("restaurante") || n.includes("padeir") || n.includes("padaria") || n.includes("cervej") || n.includes("marmita") || n.includes("aliment") || n.includes("comida") || n.includes("cozinha") || n.includes("chef") || n.includes("lanchonete") || n.includes("vinho") || n.includes("bebida") || n.includes("cogumelo") || n.includes("trufa") || n.includes("avestruz") || n.includes("apicultor") || n.includes("bar")) {
    return "alimentacao";
  }
  if (n.includes("crian") || n.includes("famili") || n.includes("pais") || n.includes("filh") || n.includes("escola") || n.includes("maternidade") || n.includes("pequeno leitor") || n.includes("buffet infantil") || n.includes("reproducao humana")) {
    return "familia";
  }
  if (n.includes("music") || n.includes("cantor") || n.includes("compos") || n.includes("dj") || n.includes("banda") || n.includes("vocal") || n.includes("artista") || n.includes("podcast")) {
    return "musica";
  }
  if (n.includes("esporte") || n.includes("atlet") || n.includes("corrida") || n.includes("ciclismo") || n.includes("futebol") || n.includes("trein") || n.includes("academia") || n.includes("personal trainer") || n.includes("yoga") || n.includes("mindfulness") || n.includes("nutricionista") || n.includes("fisioterapia") || n.includes("psicolog") || n.includes("terapeuta") || n.includes("acupuntura") || n.includes("dentista") || n.includes("odontol") || n.includes("cirurgia plastica") || n.includes("dermatologia") || n.includes("golfe") || n.includes("veterinar") || n.includes("psiquiatr") || n.includes("genetica pessoal") || n.includes("biotecnologia") || n.includes("desinfeccao hospitalar") || n.includes("cannabis") || n.includes("suplemento") || n.includes("farmacia")) {
    return "saude_esportes";
  }
  if (n.includes("moda") || n.includes("estilo") || n.includes("look") || n.includes("fashion") || n.includes("joalheria") || n.includes("beleza") || n.includes("manicure") || n.includes("salao") || n.includes("tatuagem") || n.includes("costura") || n.includes("estetica")) {
    return "moda";
  }
  if (n.includes("carbono") || n.includes("ecolog") || n.includes("recicl") || n.includes("sustent") || n.includes("verde") || n.includes("ambiental") || n.includes("solar") || n.includes("eolica")) {
    return "meio_ambiente";
  }
  if (n.includes("freelancer") || n.includes("empreended") || n.includes("startup") || n.includes("carreira") || n.includes("lider") || n.includes("design") || n.includes("dev") || n.includes("programad") || n.includes("softw") || n.includes("rha") || n.includes("advogad") || n.includes("contad") || n.includes("consult") || n.includes("rh") || n.includes("securities") || n.includes("seguro") || n.includes("tributar") || n.includes("patrimonio") || n.includes("marketing") || n.includes("seo") || n.includes("copywriter") || n.includes("fintech") || n.includes("edtech") || n.includes("criptomoedas") || n.includes("inteligencia artificial") || n.includes("software")) {
    return "carreiras";
  }
  return "b2b_geral";
}

function getProblemCategory(name: string): string {
  const staticCat = staticProblemCategories[name];
  if (staticCat) return staticCat;

  const n = normalize(name);
  
  if (n.includes("ecolog") || n.includes("verde") || n.includes("recicl") || n.includes("sustent") || n.includes("carbono") || n.includes("ambiental") || n.includes("horta coletiva") || n.includes("plantio") || n.includes("limpeza comunitaria") || n.includes("consumo") || n.includes("circular") || n.includes("impacto positivo")) {
    return "meio_ambiente";
  }
  if (n.includes("viag") || n.includes("viaj") || n.includes("explor") || n.includes("destino") || n.includes("turis") || n.includes("trilha") || n.includes("mochileiro") || n.includes("passaporte digital") || n.includes("check-in gamificado") || n.includes("mapa de experiencias") || n.includes("cidade") || n.includes("aventura") || n.includes("guia") || n.includes("lugar")) {
    return "turismo";
  }
  if (n.includes("receita") || n.includes("culinar") || n.includes("cozinhe") || n.includes("vegan") || n.includes("aliment") || n.includes("chef") || n.includes("gastronom") || n.includes("marmita") || n.includes("prato") || n.includes("cardapio") || n.includes("refeic") || n.includes("comida") || n.includes("restaurante") || n.includes("cozinha")) {
    return "alimentacao";
  }
  if (n.includes("crian") || n.includes("famili") || n.includes("pais") || n.includes("filh") || n.includes("infant") || n.includes("pequenos leitores") || n.includes("educa") || n.includes("ensino") || n.includes("aprendiz") || n.includes("escolar") || n.includes("brincando") || n.includes("historias colaborativas") || n.includes("maternidade") || n.includes("brinquedo")) {
    return "familia";
  }
  if (n.includes("cantor") || n.includes("music") || n.includes("compos") || n.includes("karaoke") || n.includes("dj") || n.includes("vocal") || n.includes("remix") || n.includes("instrumento") || n.includes("letra") || n.includes("banda virtual") || n.includes("jam sessions") || n.includes("artista") || n.includes("festival virtual")) {
    return "musica";
  }
  if (n.includes("acordar cedo") || n.includes("30 dias") || n.includes("habit") || n.includes("procrastina") || n.includes("disciplina") || n.includes("gratidao") || n.includes("foco") || n.includes("recompensa") || n.includes("mental") || n.includes("vencedor") || n.includes("coragem") || n.includes("evolucao pessoal") || n.includes("futebol") || n.includes("corrida") || n.includes("ciclismo") || n.includes("esport") || n.includes("atleta") || n.includes("treino") || n.includes("jogador") || n.includes("basquete") || n.includes("torneio") || n.includes("scout") || n.includes("resistencia") || n.includes("fitness") || n.includes("metas compartilhadas") || n.includes("diario de evolucao")) {
    return "saude_esportes";
  }
  if (n.includes("look") || n.includes("estilo") || n.includes("armario") || n.includes("moda") || n.includes("fashion") || n.includes("roupa") || n.includes("beleza") || n.includes("maquiagem") || n.includes("cabelo") || n.includes("personal shopper")) {
    return "moda";
  }
  if (n.includes("freelancer") || n.includes("empreended") || n.includes("startup") || n.includes("carreira") || n.includes("lider") || n.includes("entrevista") || n.includes("curriculo") || n.includes("portfolio") || n.includes("venda") || n.includes("negociac") || n.includes("programador") || n.includes("habilidades profissionais") || n.includes("talento") || n.includes("networking") || n.includes("mentor") || n.includes("coaching") || n.includes("especialista") || n.includes("empresaria") || n.includes("habilidade")) {
    return "carreiras";
  }
  return "b2b_geral";
}

export function IdeaGenerator() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [targetStars, setTargetStars] = useState<string>("random");
  const [country, setCountry] = useState<string>("BR");
  
  // Pools locais com fallback para dados estáticos
  const [audiencesPool, setAudiencesPool] = useState<Item[]>(audiences);
  const [problemsPool, setProblemsPool] = useState<Item[]>(problems);
  const [technologiesPool, setTechnologiesPool] = useState<Item[]>(technologies);
  const [monetizationsPool, setMonetizationsPool] = useState<Item[]>(monetizations);
  
  // Histórico de itens gerados recentemente para evitar repetições
  const [usedAudiences, setUsedAudiences] = useState<string[]>([]);
  const [usedProblems, setUsedProblems] = useState<string[]>([]);
  const [usedTechnologies, setUsedTechnologies] = useState<string[]>([]);
  const [usedMonetizations, setUsedMonetizations] = useState<string[]>([]);

  const [idea, setIdea] = useState({
    audience: "",
    problem: "",
    technology: "",
    monetization: "",
    tier: 0
  });

  const [drafts, setDrafts] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("viralbook_idea_drafts");
    if (saved) {
      try {
        setDrafts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveDraft = () => {
    if (!idea.audience || !idea.problem) return;
    
    const isDuplicate = drafts.some(d => 
      d.audience === idea.audience && 
      d.problem === idea.problem && 
      d.technology === idea.technology && 
      d.monetization === idea.monetization
    );

    if (isDuplicate) {
      alert("Este rascunho já está salvo!");
      return;
    }

    const newDraft = {
      id: Date.now().toString(),
      ...idea
    };

    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem("viralbook_idea_drafts", JSON.stringify(updated));
  };

  const deleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("viralbook_idea_drafts", JSON.stringify(updated));
  };

  const loadDraft = (draft: any) => {
    setIdea({
      audience: draft.audience,
      problem: draft.problem,
      technology: draft.technology,
      monetization: draft.monetization,
      tier: draft.tier
    });
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const getRandom = (arr: Item[], target: string, previousName?: string) => {
    let filtered = arr;
    if (target !== "random") {
      const t = parseInt(target, 10);
      filtered = arr.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
      if (filtered.length === 0) filtered = arr;
    }
    
    let pool = filtered.filter(item => item.name !== previousName);
    if (pool.length === 0) pool = filtered;

    return pool[Math.floor(Math.random() * pool.length)];
  };

  // Algoritmo de seleção exclusiva de combinação única com sincronização inteligente de dor/público
  const getUniqueCombination = () => {
    const pickUnique = (pool: Item[], used: string[], target: string, categoryFilter?: (item: Item) => boolean) => {
      let filtered = pool;
      if (target !== "random") {
        const t = parseInt(target, 10);
        filtered = pool.filter(item => item.tier >= t - 1 && item.tier <= t + 1);
        if (filtered.length === 0) filtered = pool;
      }

      // Aplica o filtro de categoria se fornecido
      if (categoryFilter) {
        const catFiltered = filtered.filter(categoryFilter);
        if (catFiltered.length > 0) {
          filtered = catFiltered;
        }
      }

      // Filtrar candidatos não utilizados recentemente
      let candidates = filtered.filter(item => !used.includes(item.name));
      let nextUsed = [...used];

      if (candidates.length === 0) {
        // Pool exaurido, reinicia o histórico
        candidates = filtered;
        nextUsed = [];
      }

      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      
      // Limita o histórico a 70% do tamanho do pool filtrado para evitar travamento
      const maxHistory = Math.max(5, Math.floor(filtered.length * 0.7));
      nextUsed.push(selected.name);
      if (nextUsed.length > maxHistory) {
        nextUsed.shift();
      }

      return { selected, nextUsed };
    };

    // 1. Sorteia o público-alvo primeiro
    const { selected: tA, nextUsed: nextAudiences } = pickUnique(audiencesPool, usedAudiences, targetStars);
    
    // 2. Determina a categoria do público-alvo para filtrar as dores (problemas) correspondentes
    const audCat = getAudienceCategory(tA.name);
    const problemFilter = (item: Item) => {
      const probCat = getProblemCategory(item.name);
      return probCat === 'b2b_geral' || probCat === audCat;
    };

    // 3. Sorteia os demais elementos com filtro de dor correspondente
    const { selected: tP, nextUsed: nextProblems } = pickUnique(problemsPool, usedProblems, targetStars, problemFilter);
    const { selected: tT, nextUsed: nextTechs } = pickUnique(technologiesPool, usedTechnologies, targetStars);
    const { selected: tM, nextUsed: nextMonetizations } = pickUnique(monetizationsPool, usedMonetizations, targetStars);

    // Salva os novos históricos
    setUsedAudiences(nextAudiences);
    setUsedProblems(nextProblems);
    setUsedTechnologies(nextTechs);
    setUsedMonetizations(nextMonetizations);

    const avgTier = Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4);

    return {
      audience: tA.name,
      problem: tP.name,
      technology: tT.name,
      monetization: tM.name,
      tier: targetStars !== "random" ? parseInt(targetStars, 10) : avgTier
    };
  };

  const getStarLabel = (tier: number) => {
    if (tier >= 6) return "🌟🌟🌟🌟🌟🌟 (>5 Estrelas)";
    if (tier === 5) return "⭐⭐⭐⭐⭐ (5 Estrelas)";
    if (tier === 4) return "⭐⭐⭐⭐ (4 Estrelas)";
    if (tier === 3) return "⭐⭐⭐ (3 Estrelas)";
    if (tier === 2) return "⭐⭐ (2 Estrelas)";
    if (tier <= 1) return "⭐ (1 Estrela)";
    return "";
  };

  const generateIdea = () => {
    setIsGenerating(true);
    
    // Pré-calcula a ideia final que é garantidamente inédita e correspondente
    const finalIdea = getUniqueCombination();
    
    let iterations = 0;
    const interval = setInterval(() => {
      // Durante o spin da animação visual, sorteia puramente itens aleatórios correspondentes
      const tA = getRandom(audiencesPool, targetStars, idea.audience);
      
      // Sincroniza a dor também durante a animação
      const audCat = getAudienceCategory(tA.name);
      const filteredProblems = problemsPool.filter(item => {
        const probCat = getProblemCategory(item.name);
        return probCat === 'b2b_geral' || probCat === audCat;
      });
      const problemsSource = filteredProblems.length > 0 ? filteredProblems : problemsPool;

      const tP = getRandom(problemsSource, targetStars, idea.problem);
      const tT = getRandom(technologiesPool, targetStars, idea.technology);
      const tM = getRandom(monetizationsPool, targetStars, idea.monetization);
      
      const avgTier = Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4);

      setIdea({
        audience: tA.name,
        problem: tP.name,
        technology: tT.name,
        monetization: tM.name,
        tier: targetStars !== "random" ? parseInt(targetStars, 10) : avgTier
      });
      
      iterations++;
      if (iterations > 15) {
        clearInterval(interval);
        // Desembarca exatamente na combinação única calculada previamente
        setIdea(finalIdea);
        setIsGenerating(false);
      }
    }, 50);
  };

  useEffect(() => {
    async function init() {
      let currentAudiences = audiences;
      let currentProblems = problems;
      let currentTechnologies = technologies;
      let currentMonetizations = monetizations;

      try {
        const { data, error } = await supabase
          .from('matrix_items')
          .select('type, name, tier');
          
        if (!error && data && data.length > 0) {
          const dbAudiences = data.filter((item: any) => item.type === 'audience').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbProblems = data.filter((item: any) => item.type === 'problem').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbTechnologies = data.filter((item: any) => item.type === 'technology').map((item: any) => ({ name: item.name, tier: item.tier }));
          const dbMonetizations = data.filter((item: any) => item.type === 'monetization').map((item: any) => ({ name: item.name, tier: item.tier }));

          if (dbAudiences.length > 0) {
            setAudiencesPool(dbAudiences);
            currentAudiences = dbAudiences;
          }
          if (dbProblems.length > 0) {
            setProblemsPool(dbProblems);
            currentProblems = dbProblems;
          }
          if (dbTechnologies.length > 0) {
            setTechnologiesPool(dbTechnologies);
            currentTechnologies = dbTechnologies;
          }
          if (dbMonetizations.length > 0) {
            setMonetizationsPool(dbMonetizations);
            currentMonetizations = dbMonetizations;
          }
        }
      } catch (err) {
        console.warn("Erro ao buscar matrizes do banco, usando fallback local:", err);
      }

      // Sorteia ideia inicial com os pools carregados de forma sincronizada
      const tA = getRandom(currentAudiences, targetStars);
      
      const audCat = getAudienceCategory(tA.name);
      const filteredProblems = currentProblems.filter(item => {
        const probCat = getProblemCategory(item.name);
        return probCat === 'b2b_geral' || probCat === audCat;
      });
      const problemsSource = filteredProblems.length > 0 ? filteredProblems : currentProblems;

      const tP = getRandom(problemsSource, targetStars);
      const tT = getRandom(currentTechnologies, targetStars);
      const tM = getRandom(currentMonetizations, targetStars);
      
      setIdea({
        audience: tA.name,
        problem: tP.name,
        technology: tT.name,
        monetization: tM.name,
        tier: Math.round((tA.tier + tP.tier + tT.tier + tM.tier) / 4)
      });

      // Registra a ideia inicial no histórico para evitar repetição logo de início
      setUsedAudiences([tA.name]);
      setUsedProblems([tP.name]);
      setUsedTechnologies([tT.name]);
      setUsedMonetizations([tM.name]);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTargetStarsChange = (value: string | null) => {
    setTargetStars(value || "random");
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(value || "BR");
  };

  const handleCopy = () => {
    const text = `SaaS B2B para ${idea.audience} resolvendo ${idea.problem} com ${idea.technology}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const text = `SaaS B2B para ${idea.audience} focado em resolver problemas de ${idea.problem} utilizando ${idea.technology} e monetizado via ${idea.monetization}`;
      const response = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          keyword: text, 
          country,
          idea: {
            audience: idea.audience,
            problem: idea.problem,
            technology: idea.technology,
            monetization: idea.monetization
          }
        }), 
      });

      if (response.ok) {
        // Limpar o cache do Next.js e forçar o redirecionamento com o país correto
        router.refresh();
        window.location.href = `/dashboard?country=${country}`;
      } else {
        alert("Erro ao analisar nicho. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão ao analisar nicho.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Contador de Combinações Premium */}
      <div className="text-center space-y-1 bg-card/25 backdrop-blur-md border border-white/5 py-4 px-6 rounded-2xl max-w-2xl mx-auto shadow-inner flex flex-col items-center justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 shadow-md">
          <Zap className="h-3.5 w-3.5 fill-primary animate-pulse text-primary" />
          {(audiencesPool.length * problemsPool.length * technologiesPool.length * monetizationsPool.length).toLocaleString('pt-BR')} Combinações Únicas de Ideias
        </span>
        <p className="text-xxs text-muted-foreground/75 font-medium mt-1">
          Alimentado por {audiencesPool.length} Públicos-Alvo • {problemsPool.length} Dores/Problemas • {technologiesPool.length} Tecnologias • {monetizationsPool.length} Monetizações
        </p>
      </div>

      {/* Controles de Geração */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
          {/* Seletor de Qualidade (Estrelas) */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Star className="h-5 w-5 text-yellow-500 ml-2 shrink-0" />
            <Select value={targetStars} onValueChange={handleTargetStarsChange}>
              <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                <SelectValue placeholder="Nível da Ideia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Qualquer Nível</SelectItem>
                <SelectItem value="6">&gt;5 Estrelas (Oceano Azul)</SelectItem>
                <SelectItem value="5">5 Estrelas (Inovador)</SelectItem>
                <SelectItem value="4">4 Estrelas (Avançado)</SelectItem>
                <SelectItem value="3">3 Estrelas (Mediano)</SelectItem>
                <SelectItem value="2">2 Estrelas (Comum)</SelectItem>
                <SelectItem value="1">1 Estrela (Saturado)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de País */}
          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-xl border border-white/5 w-full shadow-inner">
            <Globe className="h-5 w-5 text-blue-500 ml-2 shrink-0" />
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="border-0 bg-transparent text-sm md:text-base focus:ring-0">
                <SelectValue placeholder="País Alvo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BR">🇧🇷 Brasil (BR)</SelectItem>
                <SelectItem value="US">🇺🇸 Estados Unidos (US)</SelectItem>
                <SelectItem value="PT">🇵🇹 Portugal (PT)</SelectItem>
                <SelectItem value="GB">🇬🇧 Reino Unido (GB)</SelectItem>
                <SelectItem value="CA">🇨🇦 Canadá (CA)</SelectItem>
                <SelectItem value="AU">🇦🇺 Austrália (AU)</SelectItem>
                <SelectItem value="DE">🇩🇪 Alemanha (DE)</SelectItem>
                <SelectItem value="FR">🇫🇷 França (FR)</SelectItem>
                <SelectItem value="ES">🇪🇸 Espanha (ES)</SelectItem>
                <SelectItem value="IN">🇮🇳 Índia (IN)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          size="lg" 
          onClick={generateIdea} 
          disabled={isGenerating}
          className={cn(
            "h-16 px-12 text-lg font-bold rounded-full transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105",
            isGenerating && "animate-pulse"
          )}
        >
          <Shuffle className={cn("mr-3 h-6 w-6", isGenerating && "animate-spin")} />
          {isGenerating ? "Combinando Matrizes..." : "Gerar Nova Oportunidade"}
        </Button>
      </div>

      {/* Cartões de Resultados */}
      <div className="grid md:grid-cols-2 gap-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl -z-10 rounded-full" />
        
        {/* Público Alvo */}
        <Card className="glass-card border-purple-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Users className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Público-Alvo</h3>
            </div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {idea.audience || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Problema */}
        <Card className="glass-card border-red-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-red-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <Target className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Problema / Dor</h3>
            </div>
            <p className="text-3xl font-extrabold text-foreground tracking-tight">
              {idea.problem || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Tecnologia */}
        <Card className="glass-card border-blue-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <Cpu className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Tecnologia</h3>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {idea.technology || "..."}
            </p>
          </CardContent>
        </Card>

        {/* Monetização */}
        <Card className="glass-card border-green-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 text-green-400 mb-3">
              <Banknote className="h-5 w-5" />
              <h3 className="font-semibold uppercase tracking-wider text-sm">Monetização</h3>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {idea.monetization || "..."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resultado Consolidado */}
      <div className="mt-8">
        <Card className="bg-background/40 backdrop-blur-md border border-white/10 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500" />
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Resumo do Nicho</h4>
                {idea.tier > 0 && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-sm py-1">
                    {getStarLabel(idea.tier)}
                  </Badge>
                )}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                Um SaaS B2B para <span className="text-purple-400 font-bold underline decoration-purple-500/30 underline-offset-4">{idea.audience}</span> focado em resolver problemas de <span className="text-red-400 font-bold underline decoration-red-500/30 underline-offset-4">{idea.problem}</span> utilizando <span className="text-blue-400 font-bold underline decoration-blue-500/30 underline-offset-4">{idea.technology}</span> e monetizado via <span className="text-green-400 font-bold underline decoration-green-500/30 underline-offset-4">{idea.monetization}</span>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-xl border-white/10 hover:bg-white/5 text-purple-400 border-purple-500/20 hover:bg-purple-500/5 font-semibold"
                onClick={saveDraft}
                disabled={isGenerating || !idea.audience}
              >
                <Bookmark className="mr-2 h-5 w-5 fill-purple-400/10 text-purple-400" />
                Salvar Rascunho
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 rounded-xl border-white/10 hover:bg-white/5"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-green-500 font-semibold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5 text-muted-foreground" />
                    Copiar Ideia
                  </>
                )}
              </Button>
              <Button 
                variant="default" 
                size="lg" 
                className="h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-500/20"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isGenerating}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando e Criando SaaS...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5 text-yellow-300 fill-yellow-300" />
                    Analisar Nicho no Radar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banco de Rascunhos */}
      {drafts.length > 0 && (
        <div className="mt-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <FolderHeart className="h-5 w-5 text-pink-500 fill-pink-500/25" />
              Banco de Rascunhos ({drafts.length})
            </h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                if (confirm("Deseja apagar todos os rascunhos?")) {
                  setDrafts([]);
                  localStorage.removeItem("viralbook_idea_drafts");
                }
              }}
              className="text-xs text-muted-foreground hover:text-red-500"
            >
              Apagar Tudo
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => (
              <Card key={draft.id} className="bg-card/25 backdrop-blur-md border border-border/40 hover:border-border/80 transition-all duration-300 p-5 rounded-2xl relative group/draft flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className="text-[10px] text-yellow-500 border-yellow-500/20 py-0.5 font-bold">
                      {getStarLabel(draft.tier).split(" ")[0]} Tier {draft.tier}
                    </Badge>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => deleteDraft(draft.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md shrink-0 md:opacity-0 group-hover/draft:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs md:text-sm font-medium leading-relaxed text-foreground/90">
                    Um SaaS B2B para <span className="text-purple-400 font-bold">{draft.audience}</span> focado em resolver problemas de <span className="text-red-400 font-bold">{draft.problem}</span> utilizando <span className="text-blue-400 font-bold">{draft.technology}</span> e monetizado via <span className="text-green-400 font-bold">{draft.monetization}</span>.
                  </p>
                </div>
                
                <div className="mt-4 flex gap-2 justify-end border-t border-border/20 pt-3">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      const text = `SaaS B2B para ${draft.audience} resolvendo ${draft.problem} com ${draft.technology}`;
                      navigator.clipboard.writeText(text);
                      alert("Copiado!");
                    }}
                    className="text-[11px] h-8 text-muted-foreground hover:text-primary rounded-lg font-medium px-2.5"
                  >
                    Copiar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => loadDraft(draft)}
                    className="text-[11px] h-8 rounded-lg font-bold px-3 hover:bg-secondary/80"
                  >
                    Carregar no Gerador
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={async () => {
                      setIsAnalyzing(true);
                      try {
                        const text = `SaaS B2B para ${draft.audience} focado em resolver problemas de ${draft.problem} utilizando ${draft.technology} e monetizado via ${draft.monetization}`;
                        const response = await fetch("/api/radar", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ 
                            keyword: text, 
                            country,
                            idea: {
                              audience: draft.audience,
                              problem: draft.problem,
                              technology: draft.technology,
                              monetization: draft.monetization
                            }
                          }), 
                        });

                        if (response.ok) {
                          router.refresh();
                          window.location.href = `/dashboard?country=${country}`;
                        } else {
                          alert("Erro ao analisar nicho. Tente novamente.");
                        }
                      } catch (error) {
                        console.error(error);
                        alert("Erro de conexão.");
                      } finally {
                        setIsAnalyzing(false);
                      }
                    }}
                    className="text-[11px] h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/10 px-3 hover:scale-[1.02] transition-transform"
                    disabled={isAnalyzing || isGenerating}
                  >
                    Analisar no Radar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="text-center text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
        <Badge variant="outline" className="bg-white/5 border-white/10 text-xs text-muted-foreground">Matemática</Badge>
        {audiencesPool.length * problemsPool.length * technologiesPool.length * monetizationsPool.length} combinações únicas possíveis.
      </div>

    </div>
  );
}
