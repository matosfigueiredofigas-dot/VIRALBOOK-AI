"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Crown, Zap, Mail, Trash2, CheckCircle2, ShieldAlert, Loader2,
  Brain, Activity, CreditCard, TrendingUp, Plus, Check, X, ShieldCheck,
  AlertCircle, ArrowUpRight, Database, Sparkles, RefreshCw, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  id: string;
  email: string;
  role: string;
  is_premium: boolean;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "resolved";
  created_at: string;
}

interface Opp {
  id: string;
  saas_name: string;
  book_title: string;
  country: string;
  viral_opportunity_score: number;
  created_at: string;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    supabase: { status: string; latency: number };
    groq: { status: string; latency: number; configured: boolean };
    googleBooks: { status: string; latency: number };
  };
}

export function AdminPanelClient({ initialOpps }: { initialOpps: Opp[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "contacts" | "opps" | "transactions" | "copilot" | "matrices">("overview");
  const [users, setUsers] = useState<Profile[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opps, setOpps] = useState<Opp[]>(initialOpps);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Estados para matrizes de nichos
  const [matrices, setMatrices] = useState<Array<{ id: string; type: string; name: string; tier: number }>>([]);
  const [matricesLoading, setMatricesLoading] = useState(false);
  const [newMatrixItem, setNewMatrixItem] = useState({ type: "audience", name: "", tier: 3 });
  const [matrixFilter, setMatrixFilter] = useState("all");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [restoringMatrices, setRestoringMatrices] = useState(false);

  // Estados para novas funcionalidades premium
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [liveLogs, setLiveLogs] = useState<Array<{ id: number; time: string; event: string; desc: string; type: string }>>([]);
  const [seeding, setSeeding] = useState(false);

  async function seedDemoData() {
    if (!confirm("Isso limpará os dados de demonstração atuais e semeará novos dados. Deseja continuar?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST"
      });
      if (res.ok) {
        alert("Base de dados de demonstração semeada com sucesso! Recarregando dados...");
        loadAdminData();
        checkSystemHealth();
      } else {
        alert("Falha ao semear dados.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao semear banco de dados.");
    } finally {
      setSeeding(false);
    }
  }

  const changeTheme = (themeName: "dark" | "tech-ai" | "light") => {
    document.documentElement.classList.remove("dark", "light", "theme-tech-ai");
    if (themeName === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeName === "tech-ai") {
      document.documentElement.classList.add("dark", "theme-tech-ai");
    } else if (themeName === "light") {
      document.documentElement.classList.add("light");
    }
  };

  // Carregar dados de usuários e contatos
  async function loadAdminData() {
    setLoading(true);
    try {
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsers(usersData.users || []);

      const contactsRes = await fetch("/api/admin/contacts");
      const contactsData = await contactsRes.json();
      if (contactsRes.ok) setContacts(contactsData.contacts || []);
    } catch (err) {
      console.error("Erro ao carregar dados administrativos:", err);
    } finally {
      setLoading(false);
    }
  }

  // Carregar integridade do sistema
  async function checkSystemHealth() {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error("Erro ao verificar saúde do sistema:", err);
    } finally {
      setHealthLoading(false);
    }
  }

  // Gerar relatório de IA (Copilot)
  async function generateAiReport() {
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/insights");
      if (res.ok) {
        const data = await res.json();
        setAiReport(data.report);
      } else {
        setAiReport("Falha ao ligar ao motor de IA. Por favor, verifique as suas credenciais no arquivo .env.local.");
      }
    } catch (err) {
      console.error("Erro ao gerar insights de IA:", err);
      setAiReport("Erro inesperado durante a geração dos insights.");
    } finally {
      setAiLoading(false);
    }
  }

  // Adicionar logs falsos dinâmicos para simular atividade em tempo real
  useEffect(() => {
    const initialLogs = [
      { id: 1, time: "Agora mesmo", event: "Novo registo", desc: "maria_santos@gmail.com acabou de se registar.", type: "user" },
      { id: 2, time: "4 min atrás", event: "Conversão IA", desc: "Ebook 'Pense e Fique Rico' convertido em SaaS Opportunity.", type: "ai" },
      { id: 3, time: "12 min atrás", event: "Suporte Aberto", desc: "Suporte recebido de joao.pedro@hotmail.com.", type: "support" },
      { id: 4, time: "45 min atrás", event: "Favorito Guardado", desc: "Ideia 'BookSummaries CRM' favoritada.", type: "save" },
    ];
    setLiveLogs(initialLogs);

    // Adicionar um log simulado dinamicamente a cada 20 segundos
    const logInterval = setInterval(() => {
      const simulatedEvents = [
        { event: "Pesquisa de Ebook", desc: "Nova busca global por Ebooks na categoria Finanças.", type: "search" },
        { event: "Prompt Copiado", desc: "Utilizador copiou o prompt do Lovable para 'ProductivityTracker'.", type: "copy" },
        { event: "Visualização Radar", desc: "Acesso direto detetado a SaaS Opportunities (Filtro: Portugal).", type: "view" },
      ];
      
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      setLiveLogs(prev => [
        {
          id: Date.now(),
          time: "Agora mesmo",
          event: randomEvent.event,
          desc: randomEvent.desc,
          type: randomEvent.type
        },
        ...prev.slice(0, 4)
      ]);
    }, 25000);

    return () => clearInterval(logInterval);
  }, []);

  async function loadMatricesData() {
    setMatricesLoading(true);
    try {
      const res = await fetch("/api/admin/matrices");
      if (res.ok) {
        const data = await res.json();
        setMatrices(data.items || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados das matrizes:", err);
    } finally {
      setMatricesLoading(false);
    }
  }

  async function addMatrixItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newMatrixItem.name.trim()) return;

    setActionLoading("add-matrix-item");
    try {
      const res = await fetch("/api/admin/matrices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMatrixItem)
      });

      const data = await res.json();
      if (res.ok) {
        setMatrices(prev => [...prev, data.item].sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name)));
        setNewMatrixItem(prev => ({ ...prev, name: "" }));
      } else {
        alert(data.error || "Erro ao adicionar item.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar item.");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteMatrixItem(id: string) {
    if (!confirm("Tem certeza que deseja remover este termo da matriz?")) return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/matrices?id=${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setMatrices(prev => prev.filter(item => item.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao deletar item.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  async function restoreMatricesDefault() {
    if (!confirm("Isso limpará todos os itens cadastrados e restaurará a lista inicial com 150+ combinações padrão do código. Deseja prosseguir?")) return;

    setRestoringMatrices(true);
    try {
      const res = await fetch("/api/admin/matrices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Matrizes padrão restauradas com sucesso! ${data.count} termos semeados.`);
        loadMatricesData();
      } else {
        alert(data.error || "Erro ao restaurar matrizes.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao restaurar.");
    } finally {
      setRestoringMatrices(false);
    }
  }

  useEffect(() => {
    loadAdminData();
    checkSystemHealth();
    loadMatricesData();
  }, []);

  // 1. Alternar Status Premium do Usuário
  async function togglePremium(userId: string, currentStatus: boolean) {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isPremium: !currentStatus }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, is_premium: !currentStatus } : u))
        );
        // Regista o log da ação
        setLiveLogs(prev => [
          {
            id: Date.now(),
            time: "Agora mesmo",
            event: "Upgrade VIP",
            desc: `Plano alterado para ${!currentStatus ? "VIP" : "Gratuito"} no utilizador ID: ${userId.substring(0, 8)}...`,
            type: "admin"
          },
          ...prev
        ]);
      } else {
        alert("Falha ao atualizar plano.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  // 2. Alternar Role do Usuário (User <-> Admin)
  async function toggleAdminRole(userId: string, currentRole: string) {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Tem certeza que deseja mudar a role deste usuário para ${nextRole.toUpperCase()}?`)) return;

    setActionLoading(userId + "-role");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: nextRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
        );
      } else {
        alert("Falha ao atualizar permissões.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  // 3. Resolver Mensagem de Contato
  async function resolveContact(contactId: string) {
    setActionLoading(contactId);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, status: "resolved" }),
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contactId ? { ...c, status: "resolved" } : c))
        );
      } else {
        alert("Falha ao marcar como resolvida.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  // 4. Moderação - Deletar Oportunidade
  async function deleteOpportunity(oppId: string) {
    if (!confirm("Tem certeza que deseja apagar permanentemente essa ideia do banco global?")) return;

    setActionLoading(oppId);
    try {
      const res = await fetch(`/api/admin/opportunities?id=${oppId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpps((prev) => prev.filter((o) => o.id !== oppId));
      } else {
        alert("Falha ao deletar oportunidade.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  // Métricas Calculadas
  const totalUsers = users.length;
  const premiumUsers = users.filter((u) => u.is_premium).length;
  const pendingSupport = contacts.filter((c) => c.status === "pending").length;
  const totalOpps = opps.length;

  // Filtrar utilizadores gratuitos para exibir na aba de pagamentos PIX pendentes
  const freeUsersPendingPix = users.filter(u => !u.is_premium && u.email !== 'moisesdematos@gmail.com');

  return (
    <div className="space-y-6">
      
      {/* ⚡ HEADER PREMIUM DE INTEGRIDADE DO SISTEMA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card/40 border border-border/40 backdrop-blur-md p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 text-amber-500 shadow-inner">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Integridade Geral do Sistema</h2>
            <p className="text-xxs text-muted-foreground">Monitor de latência das APIs e base de dados</p>
          </div>
        </div>

        {/* Leds de Status */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          {/* Supabase Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${health?.services.supabase.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'} animate-ping duration-1000 absolute`} />
            <span className={`h-2 w-2 rounded-full ${health?.services.supabase.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
            <span className="text-muted-foreground text-xxs">Supabase:</span>
            <span className="text-foreground">{health ? `${health.services.supabase.latency}ms` : <Loader2 className="h-3 w-3 animate-spin inline" />}</span>
          </div>

          {/* Groq AI Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${health?.services.groq.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'} animate-ping duration-1000 absolute`} />
            <span className={`h-2 w-2 rounded-full ${health?.services.groq.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`} />
            <span className="text-muted-foreground text-xxs">Groq Llama 3:</span>
            <span className="text-foreground">{health ? `${health.services.groq.latency}ms` : <Loader2 className="h-3 w-3 animate-spin inline" />}</span>
          </div>

          {/* Google Books Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-border/30 shadow-sm">
            <span className={`h-2 w-2 rounded-full ${health?.services.googleBooks.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'} animate-ping duration-1000 absolute`} />
            <span className={`h-2 w-2 rounded-full ${health?.services.googleBooks.status === 'healthy' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`} />
            <span className="text-muted-foreground text-xxs">Google Books:</span>
            <span className="text-foreground">{health ? 'Pronto' : <Loader2 className="h-3 w-3 animate-spin inline" />}</span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground" 
            onClick={checkSystemHealth}
            disabled={healthLoading}
          >
            <RefreshCw className={`h-4 w-4 ${healthLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 🧭 NAVIGATION TABS PREMIUM */}
      <div className="flex border-b border-border/50 gap-2 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: "overview", label: "Visão Geral", icon: Zap },
          { id: "users", label: "Utilizadores", icon: Users },
          { id: "transactions", label: "Aprovação PIX", icon: CreditCard },
          { id: "copilot", label: "AI Admin Copilot", icon: Brain },
          { id: "matrices", label: `Gerenciar Matrizes (${matrices.length})`, icon: Database },
          { id: "contacts", label: "Suporte", icon: Mail },
          { id: "opps", label: "Moderação", icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 font-semibold text-xs transition-all relative ${
              activeTab === tab.id
                ? "border-primary text-primary bg-primary/5 rounded-t-lg"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
            }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`} />
            {tab.label}
            {tab.id === "contacts" && pendingSupport > 0 && (
              <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-xxs animate-pulse">
                {pendingSupport}
              </span>
            )}
            {tab.id === "transactions" && freeUsersPendingPix.length > 0 && (
              <span className="h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xxs">
                {freeUsersPendingPix.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="py-24 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
            <span className="text-sm font-semibold">Sincronizando dados com o Supabase...</span>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* 📊 TAB 1: VISÃO GERAL PREMIUM */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* Cards de Métricas Estilizados */}
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { title: "Total Utilizadores", val: totalUsers, icon: Users, col: "text-blue-500", desc: "Registo orgânico" },
                    { title: "Membros VIP (Premium)", val: premiumUsers, icon: Crown, col: "text-amber-500", desc: "Acessos faturados" },
                    { title: "Ideias SaaS Geradas", val: totalOpps, icon: Zap, col: "text-purple-500", desc: "Motor Ebook-to-SaaS" },
                    { title: "Suporte Pendente", val: pendingSupport, icon: Mail, col: "text-red-500", desc: "Mensagens aguardando" },
                  ].map((card, i) => (
                    <Card key={i} className="glass-card overflow-hidden relative">
                      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full" />
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{card.title}</CardTitle>
                        <card.icon className={`h-4 w-4 ${card.col}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-extrabold tracking-tight mt-1">{card.val}</div>
                        <p className="text-xxs text-muted-foreground mt-1">{card.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Secção de Gráficos e Logs em Duas Colunas */}
                <div className="grid gap-6 md:grid-cols-3">
                  
                  {/* Gráficos Interativos (2 colunas) */}
                  <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-bold text-sm text-foreground">Crescimento de Utilizadores</h3>
                          <p className="text-xxs text-muted-foreground">Novos registos nos últimos 7 dias (Simulado)</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xxs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <TrendingUp className="h-3.5 w-3.5" /> +28% esta semana
                        </div>
                      </div>

                      {/* SVG Line Graph */}
                      <div className="relative pt-4">
                        <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          
                          {/* Area path */}
                          <path 
                            d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 85, 300 50 C 350 15, 400 45, 500 10 L 500 160 L 0 160 Z" 
                            fill="url(#chartGradient)" 
                          />
                          
                          {/* Curve Path */}
                          <path 
                            d="M 0 130 C 50 110, 100 120, 150 90 C 200 60, 250 85, 300 50 C 350 15, 400 45, 500 10" 
                            fill="none" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                          />

                          {/* Data points */}
                          <circle cx="150" cy="90" r="4" fill="hsl(var(--primary))" className="cursor-pointer" />
                          <circle cx="300" cy="50" r="4" fill="hsl(var(--primary))" className="cursor-pointer" />
                          <circle cx="500" cy="10" r="6" fill="#fff" stroke="hsl(var(--primary))" strokeWidth="2.5" />
                        </svg>

                        {/* Labels */}
                        <div className="flex justify-between text-xxs text-muted-foreground mt-2 px-1">
                          <span>Seg</span>
                          <span>Ter</span>
                          <span>Qua</span>
                          <span>Qui</span>
                          <span>Sex</span>
                          <span>Sáb</span>
                          <span>Dom</span>
                        </div>
                      </div>
                    </Card>

                    {/* Distribuição de Oportunidades por Categoria */}
                    <Card className="glass-card p-6">
                      <h3 className="font-bold text-sm text-foreground mb-4">Performance do Motor Ebook-to-SaaS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-3">
                          {[
                            { name: "Produtividade & Gestão", percent: 45, color: "bg-purple-500" },
                            { name: "Finanças & Vendas", percent: 30, color: "bg-green-500" },
                            { name: "Marketing & Redação", percent: 15, color: "bg-blue-500" },
                            { name: "Outros", percent: 10, color: "bg-gray-500" },
                          ].map((item, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-xxs">
                                <span className="font-medium text-foreground">{item.name}</span>
                                <span className="text-muted-foreground">{item.percent}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Donut Chart (SVG) */}
                        <div className="flex justify-center relative py-4">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                            {/* Segmento 1: 45% (dasharray: 2 * PI * r = 314.15 -> 45% = 141.3) */}
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgb(168, 85, 247)" strokeWidth="12" 
                                    strokeDasharray="141.3 314.15" strokeDashoffset="0" />
                            {/* Segmento 2: 30% (30% = 94.2) */}
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgb(34, 197, 94)" strokeWidth="12" 
                                    strokeDasharray="94.2 314.15" strokeDashoffset="-141.3" />
                            {/* Segmento 3: 15% (15% = 47.1) */}
                            <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgb(59, 130, 246)" strokeWidth="12" 
                                    strokeDasharray="47.1 314.15" strokeDashoffset="-235.5" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold">{totalOpps}</span>
                            <span className="text-xxs text-muted-foreground">SaaS Ativos</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                  </div>

                  {/* 🔔 LIVE SYSTEM ACTIVITY FEED (1 coluna) */}
                  <Card className="glass-card p-6 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <Activity className="h-4 w-4 text-primary animate-pulse" /> Atividade em Tempo Real
                        </h3>
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-ping" />
                      </div>
                      
                      <div className="space-y-4">
                        {liveLogs.map((log) => (
                          <div key={log.id} className="relative pl-6 pb-2 border-l border-border/40 last:border-0 last:pb-0 text-xxs">
                            <span className="absolute left-[-4.5px] top-1.5 h-2 w-2 rounded-full bg-primary/60 border border-background shadow-[0_0_4px_rgba(255,255,255,0.2)]" />
                            <div className="flex justify-between text-muted-foreground mb-0.5">
                              <span className="font-semibold text-foreground">{log.event}</span>
                              <span>{log.time}</span>
                            </div>
                            <p className="text-muted-foreground/80 leading-relaxed">{log.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/20 mt-4 bg-muted/10 p-3 rounded-lg text-xxs text-muted-foreground flex justify-between items-center">
                      <span>Simulador de Tráfego: Ativo</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                    </div>
                  </Card>

                </div>

                {/* 🛠️ GLOBAL ADMIN TOOLS GRID */}
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                  
                  {/* Seeder Box */}
                  <Card className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-2">
                        <Database className="h-4.5 w-4.5 text-primary" /> Semeador de Dados Demo
                      </h3>
                      <p className="text-xxs text-muted-foreground leading-relaxed">
                        Popule o banco de dados Supabase instantaneamente com 4 ideias de SaaS altamente detalhadas baseadas em livros famosos (Atomic Habits, The Lean Startup, etc.) e tickets de suporte de teste. Isso preencherá os gráficos e tabelas para testes imediatos.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/10 flex justify-between items-center">
                      <span className="text-xxs text-muted-foreground font-medium">Lembrete: Isso limpará os dados de teste antigos.</span>
                      <Button
                        size="sm"
                        onClick={seedDemoData}
                        disabled={seeding}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xxs h-8 px-4"
                      >
                        {seeding ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" /> Semear...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3 mr-1" /> Semear Banco
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>

                  {/* Theme Switcher Box */}
                  <Card className="glass-card p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 mb-2">
                        <Sparkles className="h-4.5 w-4.5 text-amber-500 animate-pulse" /> Estética & Customização Premium
                      </h3>
                      <p className="text-xxs text-muted-foreground leading-relaxed">
                        Experimente alternar o tema visual da plataforma com um clique. Alterne entre o tema padrão Vercel e o tema experimental Tech AI Neon (Midnight Deep Blue) para impressionar clientes.
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/10 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeTheme("dark")}
                        className="text-xxs h-8 flex-1"
                      >
                        Vercel Dark
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeTheme("tech-ai")}
                        className="text-xxs h-8 flex-1 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 font-bold"
                      >
                        Tech AI Neon
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changeTheme("light")}
                        className="text-xxs h-8 flex-1"
                      >
                        Light Mode
                      </Button>
                    </div>
                  </Card>

                </div>

              </div>
            )}

            {/* 👥 TAB 2: UTILIZADORES */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-foreground">Utilizadores Registados</h3>
                  <span className="text-xs text-muted-foreground">{totalUsers} utilizadores totais</span>
                </div>
                <div className="border border-border/40 rounded-xl overflow-hidden bg-card/20 backdrop-blur-md">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-4">E-mail</th>
                        <th className="p-4">Cargo</th>
                        <th className="p-4">Premium (VIP)</th>
                        <th className="p-4">Data Registo</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-semibold flex items-center gap-2">
                            {user.email}
                            {user.email === 'moisesdematos@gmail.com' && <BadgeAdmin />}
                          </td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-0.5 rounded-full text-xxs font-medium ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-muted text-muted-foreground'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {user.is_premium ? (
                              <span className="inline-flex items-center gap-1 text-yellow-500 font-bold">
                                <Crown className="h-3.5 w-3.5 fill-yellow-500" /> Premium
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Gratuito</span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground text-xxs">
                            {new Date(user.created_at).toLocaleDateString("pt-PT")}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={user.is_premium ? "text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8" : "text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 h-8 font-semibold"}
                              onClick={() => togglePremium(user.id, user.is_premium)}
                              disabled={actionLoading === user.id}
                            >
                              {actionLoading === user.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : user.is_premium ? (
                                "Remover VIP"
                              ) : (
                                "Dar VIP"
                              )}
                            </Button>
                            {user.email !== 'moisesdematos@gmail.com' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground h-8"
                                onClick={() => toggleAdminRole(user.id, user.role)}
                                disabled={actionLoading === user.id + "-role"}
                              >
                                {user.role === "admin" ? "Tornar User" : "Tornar Admin"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 💸 TAB 3: APROVAÇÃO PIX / PAGAMENTOS PREMIUM */}
            {activeTab === "transactions" && (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl p-4 flex gap-3 text-xs leading-relaxed">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Aprovação Manual Integrada:</span> A lista abaixo contém utilizadores em plano gratuito. Ao aprovar um pagamento manual (via PIX, Stripe pendente ou Transferência Bancária), a role do utilizador é atualizada instantaneamente no Supabase para VIP.
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base text-foreground">Solicitações de Upgrade Pendentes</h3>
                  <span className="text-xs font-semibold text-amber-500">{freeUsersPendingPix.length} aguardando</span>
                </div>

                <div className="border border-border/40 rounded-xl overflow-hidden bg-card/20 backdrop-blur-md">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-4">Utilizador</th>
                        <th className="p-4">Método Proposto</th>
                        <th className="p-4">Status Transação</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4 text-right">Ação Rápida</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {freeUsersPendingPix.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground font-medium">
                            Nenhum utilizador gratuito qualificado para upgrade pendente neste momento. Todos os utilizadores ativos são VIP.
                          </td>
                        </tr>
                      ) : (
                        freeUsersPendingPix.map((freeUser) => (
                          <tr key={freeUser.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 font-semibold text-foreground">{freeUser.email}</td>
                            <td className="p-4 font-medium flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> PIX / Transferência
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                                Aguardando PIX
                              </span>
                            </td>
                            <td className="p-4 font-extrabold text-foreground">€19.90 <span className="text-xxs font-normal text-muted-foreground">(Vitalício)</span></td>
                            <td className="p-4 text-right">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 text-xxs gap-1.5 shadow-md shadow-green-600/10"
                                onClick={() => togglePremium(freeUser.id, false)}
                                disabled={actionLoading === freeUser.id}
                              >
                                {actionLoading === freeUser.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <Check className="h-3.5 w-3.5" /> Aprovar VIP
                                  </>
                                )}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Histórico Simulado de Faturamento */}
                <div className="mt-8 space-y-4">
                  <h4 className="font-bold text-sm text-foreground">Receitas Recentes Processadas</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4 glass-card">
                      <div className="flex justify-between items-center text-xxs text-muted-foreground">
                        <span>Faturamento Total Estimado</span>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold mt-1 text-green-500">€{premiumUsers * 19.90}</div>
                      <p className="text-xxs text-muted-foreground mt-1">Baseado em licenças de €19.90</p>
                    </Card>
                    <Card className="p-4 glass-card">
                      <div className="flex justify-between items-center text-xxs text-muted-foreground">
                        <span>Conversão de Checkout</span>
                        <Activity className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold mt-1">{(totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(1) : 0)}%</div>
                      <p className="text-xxs text-muted-foreground mt-1">Rácio VIP vs Gratuito</p>
                    </Card>
                    <Card className="p-4 glass-card">
                      <div className="flex justify-between items-center text-xxs text-muted-foreground">
                        <span>Método Favorito</span>
                        <CreditCard className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold mt-1">PIX Local</div>
                      <p className="text-xxs text-muted-foreground mt-1">85% das adesões</p>
                    </Card>
                  </div>
                </div>

              </div>
            )}

            {/* 🤖 TAB 4: AI ADMIN COPILOT (INSIGHTS COM GROQ) */}
            {activeTab === "copilot" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 p-6 rounded-2xl">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Brain className="h-6 w-6 text-purple-500 animate-pulse" /> AI Admin Copilot
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      Nosso copiloto analisa em tempo real os dados de SaaS carregados na sua moderação, identificando nichos geográficos de conversão, scores médios e recomendando planos de expansão com inteligência artificial.
                    </p>
                  </div>

                  <Button
                    onClick={generateAiReport}
                    disabled={aiLoading}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/95 hover:to-purple-600/95 text-white font-extrabold text-xs shadow-lg shadow-primary/20 h-11 px-5 gap-2 shrink-0 animate-bounce hover:animate-none"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Gerando Relatório...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5" /> Gerar Insights do Copiloto
                      </>
                    )}
                  </Button>
                </div>

                {/* Renderização do Relatório da IA */}
                {aiLoading ? (
                  <div className="border border-border/40 rounded-xl p-12 bg-card/25 text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm font-semibold text-foreground">A IA está consolidando oportunidades e estruturando o relatório executivo...</p>
                    <p className="text-xxs text-muted-foreground max-w-sm mx-auto">Esta operação utiliza modelos de contingência multi-agente baseados na chave de API Groq configurada.</p>
                  </div>
                ) : aiReport ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border/40 rounded-2xl p-6 bg-card/40 backdrop-blur-md relative overflow-hidden"
                  >
                    <div className="absolute top-4 right-4 text-xxs font-bold text-purple-500 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 uppercase">
                      Llama-3 Insights
                    </div>
                    <div className="prose prose-sm prose-invert max-w-none text-xs leading-relaxed space-y-4">
                      {/* Renderizador rápido de Markdown simples */}
                      {aiReport.split('\n\n').map((paragraph, index) => {
                        if (paragraph.startsWith('### ')) {
                          return <h3 key={index} className="text-sm font-bold text-primary mt-6 mb-2 border-b border-border/30 pb-1 flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> {paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.startsWith('## ')) {
                          return <h2 key={index} className="text-base font-extrabold text-foreground mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                        }
                        if (paragraph.startsWith('*')) {
                          return (
                            <ul key={index} className="list-disc pl-5 space-y-2">
                              {paragraph.split('\n').map((li, i) => (
                                <li key={i} className="text-muted-foreground">{li.replace('* ', '').replace('*', '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        return <p key={index} className="text-muted-foreground whitespace-pre-line">{paragraph}</p>;
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <div className="border border-border/30 border-dashed rounded-xl p-12 text-center text-muted-foreground text-xs">
                    <Sparkles className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                    Clique no botão acima para alimentar a IA e obter as recomendações de expansão do sistema.
                  </div>
                )}
              </div>
            )}

            {/* 💬 TAB 5: MENSAGENS DE SUPORTE */}
            {activeTab === "contacts" && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-foreground">Mensagens da Landing Page</h3>
                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground text-xs">Nenhuma mensagem enviada ainda.</div>
                  ) : (
                    contacts.map((c) => (
                      <div 
                        key={c.id} 
                        className={`border rounded-xl p-6 transition-colors ${
                          c.status === 'pending' 
                            ? 'border-red-500/20 bg-red-500/5' 
                            : 'border-border/40 bg-background/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                            <p className="text-xxs text-muted-foreground">{c.email} • {new Date(c.created_at).toLocaleString("pt-PT")}</p>
                          </div>
                          <div>
                            {c.status === "pending" ? (
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white text-xxs font-bold h-8"
                                onClick={() => resolveContact(c.id)}
                                disabled={actionLoading === c.id}
                              >
                                {actionLoading === c.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar Resolvido
                                  </>
                                )}
                              </Button>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xxs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                <CheckCircle2 className="h-3 w-3" /> Resolvido
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/20 p-4 rounded-lg border border-border/20 leading-relaxed">
                          {c.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 🛡️ TAB 6: MODERAÇÃO DE OPORTUNIDADES */}
            {activeTab === "opps" && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-foreground">Moderação de Ideias SaaS</h3>
                <div className="border border-border/40 rounded-xl overflow-hidden bg-card/20 backdrop-blur-md">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-4">Nome SaaS</th>
                        <th className="p-4">Livro Origem</th>
                        <th className="p-4">País</th>
                        <th className="p-4">Score</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {opps.map((opp) => (
                        <tr key={opp.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 font-bold text-primary">{opp.saas_name}</td>
                          <td className="p-4 max-w-[200px] truncate">{opp.book_title}</td>
                          <td className="p-4 uppercase">{opp.country}</td>
                          <td className="p-4 font-extrabold text-foreground">{opp.viral_opportunity_score}</td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                              onClick={() => deleteOpportunity(opp.id)}
                              disabled={actionLoading === opp.id}
                            >
                              {actionLoading === opp.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 🗄️ TAB 7: GESTÃO DE MATRIZES */}
            {activeTab === "matrices" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-base text-foreground">Gestão de Matrizes de Nicho</h3>
                    <p className="text-xxs text-muted-foreground mt-1">Configure os públicos, dores, tecnologias e monetizações disponíveis no gerador.</p>
                  </div>
                  <Button
                    onClick={restoreMatricesDefault}
                    disabled={restoringMatrices}
                    variant="outline"
                    size="sm"
                    className="border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 font-bold text-xxs h-9 gap-1.5"
                  >
                    {restoringMatrices ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Restaurando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" /> Restaurar Matrizes Padrão
                      </>
                    )}
                  </Button>
                </div>

                {/* Painel de Estatísticas da Matriz */}
                <div className="grid gap-3 grid-cols-2 md:grid-cols-5 animate-in fade-in duration-300">
                  <Card className="p-3 bg-card/20 border border-border/20 shadow-sm flex flex-col justify-center">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total de Termos</div>
                    <div className="text-xl font-extrabold text-foreground mt-0.5">{matrices.length}</div>
                  </Card>
                  <Card className="p-3 bg-card/20 border border-border/20 shadow-sm flex flex-col justify-center border-l-purple-500/35 border-l-2">
                    <div className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Públicos-Alvo</div>
                    <div className="text-xl font-extrabold text-foreground mt-0.5">{matrices.filter(m => m.type === 'audience').length}</div>
                  </Card>
                  <Card className="p-3 bg-card/20 border border-border/20 shadow-sm flex flex-col justify-center border-l-red-500/35 border-l-2">
                    <div className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Dores / Problemas</div>
                    <div className="text-xl font-extrabold text-foreground mt-0.5">{matrices.filter(m => m.type === 'problem').length}</div>
                  </Card>
                  <Card className="p-3 bg-card/20 border border-border/20 shadow-sm flex flex-col justify-center border-l-blue-500/35 border-l-2">
                    <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Tecnologias</div>
                    <div className="text-xl font-extrabold text-foreground mt-0.5">{matrices.filter(m => m.type === 'technology').length}</div>
                  </Card>
                  <Card className="p-3 bg-card/20 border border-border/20 shadow-sm flex flex-col justify-center border-l-green-500/35 border-l-2">
                    <div className="text-[10px] text-green-400 uppercase font-bold tracking-wider">Monetizações</div>
                    <div className="text-xl font-extrabold text-foreground mt-0.5">{matrices.filter(m => m.type === 'monetization').length}</div>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Formulário de Adicionar (1 Coluna) */}
                  <Card className="glass-card p-6 h-fit">
                    <h4 className="font-bold text-sm text-foreground mb-4">Adicionar Termo à Matriz</h4>
                    <form onSubmit={addMatrixItem} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground font-medium">Categoria</label>
                        <select
                          value={newMatrixItem.type}
                          onChange={(e) => setNewMatrixItem(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full bg-background/50 border border-border/40 p-2.5 rounded-xl text-foreground focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="audience">👥 Público-Alvo</option>
                          <option value="problem">🎯 Problema / Dor</option>
                          <option value="technology">💻 Tecnologia</option>
                          <option value="monetization">💰 Monetização</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-muted-foreground font-medium">Nome do Termo</label>
                        <input
                          type="text"
                          required
                          value={newMatrixItem.name}
                          onChange={(e) => setNewMatrixItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Clínicas Médicas, Agendamento..."
                          className="w-full bg-background/50 border border-border/40 p-2.5 rounded-xl text-foreground focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-muted-foreground font-medium">Tier (Nível de Estrelas / Complexidade)</label>
                        <select
                          value={newMatrixItem.tier}
                          onChange={(e) => setNewMatrixItem(prev => ({ ...prev, tier: parseInt(e.target.value) }))}
                          className="w-full bg-background/50 border border-border/40 p-2.5 rounded-xl text-foreground focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="1">⭐ Tier 1 - Saturado / Básico</option>
                          <option value="2">⭐⭐ Tier 2 - Comum / Simples</option>
                          <option value="3">⭐⭐⭐ Tier 3 - Médio</option>
                          <option value="4">⭐⭐⭐⭐ Tier 4 - Avançado</option>
                          <option value="5">⭐⭐⭐⭐⭐ Tier 5 - Inovador / High-tech</option>
                          <option value="6">🌟🌟🌟🌟🌟🌟 Tier 6 - Oceano Azul / Complexo</option>
                        </select>
                      </div>

                      <Button
                        type="submit"
                        disabled={actionLoading === "add-matrix-item"}
                        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-10 rounded-xl mt-2"
                      >
                        {actionLoading === "add-matrix-item" ? (
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1.5 inline" /> Adicionar Termo
                          </>
                        )}
                      </Button>
                    </form>
                  </Card>

                  {/* Listagem de Termos (2 Colunas) */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Barra de Filtros e Busca */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Buscar termo na matriz..."
                        value={matrixSearch}
                        onChange={(e) => setMatrixSearch(e.target.value)}
                        className="flex-1 bg-card/20 border border-border/40 p-2.5 rounded-xl text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      />
                      <select
                        value={matrixFilter}
                        onChange={(e) => setMatrixFilter(e.target.value)}
                        className="bg-card/20 border border-border/40 p-2.5 rounded-xl text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="all">Todas Categorias</option>
                        <option value="audience">Público-Alvo</option>
                        <option value="problem">Problema / Dor</option>
                        <option value="technology">Tecnologia</option>
                        <option value="monetization">Monetização</option>
                      </select>
                    </div>

                    {/* Tabela de Termos */}
                    <div className="border border-border/40 rounded-xl overflow-hidden bg-card/20 backdrop-blur-md max-h-[500px] overflow-y-auto">
                      {matricesLoading ? (
                        <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          <span className="text-xxs font-semibold">Carregando itens da matriz...</span>
                        </div>
                      ) : (
                        <table className="w-full text-xs text-left">
                          <thead className="bg-muted/40 border-b border-border/40 text-muted-foreground font-semibold sticky top-0 backdrop-blur-md z-10">
                            <tr>
                              <th className="p-3">Nome</th>
                              <th className="p-3">Categoria</th>
                              <th className="p-3">Tier</th>
                              <th className="p-3 text-right">Ação</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {matrices.filter(item => {
                              const matchesFilter = matrixFilter === "all" || item.type === matrixFilter;
                              const matchesSearch = item.name.toLowerCase().includes(matrixSearch.toLowerCase());
                              return matchesFilter && matchesSearch;
                            }).length === 0 ? (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">
                                  Nenhum termo encontrado com os filtros atuais.
                                </td>
                              </tr>
                            ) : (
                              matrices.filter(item => {
                                const matchesFilter = matrixFilter === "all" || item.type === matrixFilter;
                                const matchesSearch = item.name.toLowerCase().includes(matrixSearch.toLowerCase());
                                return matchesFilter && matchesSearch;
                              }).map((item) => (
                                <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                                  <td className="p-3 font-semibold text-foreground">{item.name}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xxs font-bold uppercase tracking-wider ${
                                      item.type === 'audience' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                      item.type === 'problem' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                      item.type === 'technology' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                      'bg-green-500/10 text-green-400 border border-green-500/20'
                                    }`}>
                                      {item.type === 'audience' ? '👥 Público' :
                                       item.type === 'problem' ? '🎯 Dor' :
                                       item.type === 'technology' ? '💻 Tech' :
                                       '💰 Monetização'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-yellow-500 font-medium">
                                    {item.tier >= 6 ? "🌟🌟🌟🌟🌟🌟" : "⭐".repeat(item.tier)}
                                  </td>
                                  <td className="p-3 text-right">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7"
                                      onClick={() => deleteMatrixItem(item.id)}
                                      disabled={actionLoading === item.id}
                                    >
                                      {actionLoading === item.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BadgeAdmin() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold bg-red-500/15 text-red-400 border border-red-500/25">
      DONO
    </span>
  );
}
