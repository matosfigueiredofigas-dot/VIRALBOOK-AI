"use client";

import { 
  LayoutDashboard, 
  Lightbulb, 
  Sparkles, 
  Activity, 
  BookOpen, 
  BarChart3, 
  PlayCircle, 
  Heart, 
  Shield, 
  LogIn, 
  Settings,
  Globe,
  Mail,
  Users
} from "lucide-react";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "@/components/sidebar-link";

export function SidebarMenuClient() {
  const ideacaoItems = [
    {
      title: "Biblioteca de Ideias",
      url: "/library",
      icon: Sparkles,
      dataTour: "sidebar-library"
    },
    {
      title: "Ebooks Radar",
      url: "/radar",
      icon: BookOpen,
      dataTour: "sidebar-radar"
    },
    {
      title: "Emerging Niches",
      url: "/niches",
      icon: Activity,
    },
    {
      title: "Global Trends",
      url: "/trends",
      icon: BarChart3,
    },
  ];

  const validacaoItems = [
    {
      title: "SaaS Opportunities",
      url: "/opportunities",
      icon: Lightbulb,
    },
    {
      title: "Landing Pages",
      url: "/landing-pages",
      icon: Globe,
    },
    {
      title: "Conselho de Mentores",
      url: "/advisors",
      icon: Users,
    },
  ];

  const tracaoItems = [
    {
      title: "Automação de E-mails",
      url: "/email-funnel",
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Comece por Aqui & Dashboard */}
      <SidebarMenu className="gap-1.5">
        <SidebarLink
          href="/welcome"
          icon={PlayCircle}
          title="Comece por Aqui"
          variant="welcome"
        />
        <SidebarLink
          href="/dashboard"
          icon={LayoutDashboard}
          title="Dashboard"
          dataTour="sidebar-dashboard"
        />
      </SidebarMenu>

      {/* Fase 1: Ideação */}
      <div>
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground/50 uppercase px-3 mb-2">
          🧠 Fase 1: Ideação
        </div>
        <SidebarMenu className="gap-1.5">
          {ideacaoItems.map((item) => (
            <SidebarLink
              key={item.title}
              href={item.url}
              icon={item.icon}
              title={item.title}
              dataTour={(item as any).dataTour}
            />
          ))}
        </SidebarMenu>
      </div>

      {/* Fase 2: Validação */}
      <div>
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground/50 uppercase px-3 mb-2">
          🚀 Fase 2: Validação
        </div>
        <SidebarMenu className="gap-1.5">
          {validacaoItems.map((item) => (
            <SidebarLink
              key={item.title}
              href={item.url}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </SidebarMenu>
      </div>

      {/* Fase 3: Tração & Vendas */}
      <div>
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground/50 uppercase px-3 mb-2">
          📣 Fase 3: Tração & Vendas
        </div>
        <SidebarMenu className="gap-1.5">
          {tracaoItems.map((item) => (
            <SidebarLink
              key={item.title}
              href={item.url}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </SidebarMenu>
      </div>
    </div>
  );
}

export function SidebarMyAccountClient() {
  return (
    <SidebarMenu className="gap-2">
      <SidebarLink
        href="/favorites"
        icon={Heart}
        title="Favoritos Salvos"
        variant="favorite"
      />
    </SidebarMenu>
  );
}

export function SidebarAdminClient({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  return (
    <SidebarMenu className="gap-2">
      <SidebarLink
        href="/admin"
        icon={Shield}
        title="Painel Admin"
        variant="admin"
      />
    </SidebarMenu>
  );
}

export function SidebarFooterLinksClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <SidebarMenu className="gap-2">
      {!isAuthenticated && (
        <SidebarLink
          href="/login"
          icon={LogIn}
          title="Login / Autenticação"
        />
      )}
      <SidebarLink
        href="/settings"
        icon={Settings}
        title="Configurações"
      />
    </SidebarMenu>
  );
}
