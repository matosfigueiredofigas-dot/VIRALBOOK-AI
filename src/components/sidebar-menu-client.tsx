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
  Settings 
} from "lucide-react";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "@/components/sidebar-link";

interface SidebarMenuClientProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export function SidebarMenuClient() {
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "SaaS Opportunities",
      url: "/opportunities",
      icon: Lightbulb,
    },
    {
      title: "Biblioteca de Ideias",
      url: "/library",
      icon: Sparkles,
    },
    {
      title: "Emerging Niches",
      url: "/niches",
      icon: Activity,
    },
    {
      title: "Ebooks Radar",
      url: "/radar",
      icon: BookOpen,
    },
    {
      title: "Global Trends",
      url: "/trends",
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Comece por Aqui */}
      <SidebarMenu className="mb-4">
        <SidebarLink
          href="/welcome"
          icon={PlayCircle}
          title="Comece por Aqui"
          variant="welcome"
        />
      </SidebarMenu>

      {/* Menu Principal */}
      <SidebarMenu className="gap-2">
        {items.map((item) => (
          <SidebarLink
            key={item.title}
            href={item.url}
            icon={item.icon}
            title={item.title}
          />
        ))}
      </SidebarMenu>
    </>
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
