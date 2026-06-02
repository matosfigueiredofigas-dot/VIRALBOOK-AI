"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown, Zap, Mail, Trash2, CheckCircle2, ShieldAlert, Loader2 } from "lucide-react";

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

export function AdminPanelClient({ initialOpps }: { initialOpps: Opp[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "contacts" | "opps">("overview");
  const [users, setUsers] = useState<Profile[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opps, setOpps] = useState<Opp[]>(initialOpps);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Carregar dados de usuários e contatos
  async function loadAdminData() {
    setLoading(true);
    try {
      // Busca usuários
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsers(usersData.users || []);

      // Busca contatos
      const contactsRes = await fetch("/api/admin/contacts");
      const contactsData = await contactsRes.json();
      if (contactsRes.ok) setContacts(contactsData.contacts || []);
    } catch (err) {
      console.error("Erro ao carregar dados administrativos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
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

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-border/50 gap-4 overflow-x-auto pb-px">
        {[
          { id: "overview", label: "Visão Geral", icon: Zap },
          { id: "users", label: "Utilizadores", icon: Users },
          { id: "contacts", label: "Mensagens Suporte", icon: Mail },
          { id: "opps", label: "Moderação Radar", icon: ShieldAlert },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 text-center text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Carregando dados administrativos...
        </div>
      ) : (
        <>
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Utilizadores</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalUsers}</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Membros Premium (VIP)</CardTitle>
                    <Crown className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{premiumUsers}</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ideias SaaS Geradas</CardTitle>
                    <Zap className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalOpps}</div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Suporte Pendente</CardTitle>
                    <Mail className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{pendingSupport}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações rápidas */}
              <div className="bg-muted/30 border border-border/50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg">Avisos do Administrador</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Para habilitar novos administradores ou liberar licenças vitalícias compradas via Pix, Stripe ou transferências, vá para a aba **Utilizadores** e selecione o botão de upgrade correspondente. O banco de dados do Supabase é sincronizado instantaneamente.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: UTILIZADORES */}
          {activeTab === "users" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-foreground">Utilizadores Registrados</h3>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4">E-mail</th>
                      <th className="p-4">Cargo (Role)</th>
                      <th className="p-4">Premium (VIP)</th>
                      <th className="p-4">Data Registro</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium flex items-center gap-2">
                          {user.email}
                          {user.email === 'moisesdematos@gmail.com' && <BadgeAdmin />}
                        </td>
                        <td className="p-4 capitalize">{user.role}</td>
                        <td className="p-4">
                          {user.is_premium ? (
                            <span className="inline-flex items-center gap-1 text-yellow-500 font-semibold">
                              <Crown className="h-3 w-3 fill-yellow-500" /> Premium
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Gratuito</span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(user.created_at).toLocaleDateString("pt-PT")}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={user.is_premium ? "text-red-400 hover:text-red-300" : "text-yellow-500 hover:text-yellow-400"}
                            onClick={() => togglePremium(user.id, user.is_premium)}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : user.is_premium ? (
                              "Remover VIP"
                            ) : (
                              "Tornar VIP"
                            )}
                          </Button>
                          {user.email !== 'moisesdematos@gmail.com' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground"
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

          {/* TAB 3: MENSAGENS DE SUPORTE */}
          {activeTab === "contacts" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-foreground">Mensagens da Landing Page</h3>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">Nenhuma mensagem enviada ainda.</div>
                ) : (
                  contacts.map((c) => (
                    <div 
                      key={c.id} 
                      className={`border rounded-xl p-6 transition-colors ${
                        c.status === 'pending' 
                          ? 'border-red-500/20 bg-red-500/5' 
                          : 'border-border/50 bg-background'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-base">{c.name}</h4>
                          <p className="text-xs text-muted-foreground">{c.email} • {new Date(c.created_at).toLocaleString("pt-PT")}</p>
                        </div>
                        <div>
                          {c.status === "pending" ? (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => resolveContact(c.id)}
                              disabled={actionLoading === c.id}
                            >
                              {actionLoading === c.id ? (
                                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar Resolvido
                                </>
                              )}
                            </Button>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Resolvido
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground bg-muted/20 p-4 rounded-lg border border-border/20 leading-relaxed">
                        {c.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: MODERAÇÃO DE OPORTUNIDADES */}
          {activeTab === "opps" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="font-bold text-lg text-foreground">Moderação de Ideias SaaS</h3>
              <div className="border border-border/50 rounded-xl overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b border-border/50 text-muted-foreground font-medium">
                    <tr>
                      <th className="p-4">Nome SaaS</th>
                      <th className="p-4">Livro Origem</th>
                      <th className="p-4">País</th>
                      <th className="p-4">Score</th>
                      <th className="p-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {opps.map((opp) => (
                      <tr key={opp.id} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-bold text-primary">{opp.saas_name}</td>
                        <td className="p-4 max-w-[200px] truncate">{opp.book_title}</td>
                        <td className="p-4">{opp.country}</td>
                        <td className="p-4 font-semibold">{opp.viral_opportunity_score}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
        </>
      )}
    </div>
  );
}

function BadgeAdmin() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
      DONO
    </span>
  );
}
