"use client";

import { 
  LayoutDashboard, 
  Sparkles, 
  BookOpen, 
  PlayCircle, 
  Heart, 
  Shield, 
  LogIn, 
  Settings,
  Globe,
  Globe2,
  Mail,
  Users
} from "lucide-react";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "@/components/sidebar-link";
import { useLanguage } from "@/contexts/language-context";

export function SidebarMenuClient() {
  const { t } = useLanguage();

  const ideacaoItems = [
    {
      title: t.navigation.library,
      url: "/library",
      icon: Sparkles,
      dataTour: "sidebar-library"
    },
    {
      title: t.navigation.radar,
      url: "/radar",
      icon: BookOpen,
      dataTour: "sidebar-radar"
    }
  ];

  const validacaoItems = [
    {
      title: t.navigation.landingPages,
      url: "/landing-pages",
      icon: Globe,
    },
    {
      title: t.navigation.advisors,
      url: "/advisors",
      icon: Users,
    },
  ];

  const tracaoItems = [
    {
      title: t.navigation.emailFunnel,
      url: "/email-funnel",
      icon: Mail,
    },
    {
      title: t.navigation.showcase,
      url: "/showcase",
      icon: Globe2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Comece por Aqui & Dashboard & Manual */}
      <SidebarMenu className="gap-1.5">
        <SidebarLink
          href="/welcome"
          icon={PlayCircle}
          title={t.navigation.startHere}
          variant="welcome"
        />
        <SidebarLink
          href="/docs"
          icon={BookOpen}
          title="Manual Oficial"
        />
        <SidebarLink
          href="/dashboard"
          icon={LayoutDashboard}
          title={t.navigation.dashboard}
          dataTour="sidebar-dashboard"
        />
      </SidebarMenu>

      {/* Fase 1: Ideação */}
      <div>
        <div className="text-[10px] font-bold tracking-wider text-muted-foreground/50 uppercase px-3 mb-2">
          {t.navigation.phase1}
        </div>
        <SidebarMenu className="gap-1.5">
          {ideacaoItems.map((item) => (
            <SidebarLink
              key={item.url}
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
          {t.navigation.phase2}
        </div>
        <SidebarMenu className="gap-1.5">
          {validacaoItems.map((item) => (
            <SidebarLink
              key={item.url}
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
          {t.navigation.phase3}
        </div>
        <SidebarMenu className="gap-1.5">
          {tracaoItems.map((item) => (
            <SidebarLink
              key={item.url}
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

export function SidebarGroupLabelClient({ type }: { type: 'myAccount' | 'admin' }) {
  const { t } = useLanguage();
  return (
    <span className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">
      {type === 'myAccount' ? t.common.myAccount : t.common.administration}
    </span>
  );
}

export function SidebarLogoutClient() {
  const { t } = useLanguage();
  return (
    <span className="font-medium text-sm">{t.common.logout}</span>
  );
}

export function SidebarMyAccountClient() {
  const { t } = useLanguage();
  return (
    <SidebarMenu className="gap-2">
      <SidebarLink
        href="/favorites"
        icon={Heart}
        title={t.navigation.favorites}
        variant="favorite"
      />
    </SidebarMenu>
  );
}

export function SidebarAdminClient({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useLanguage();
  if (!isAdmin) return null;
  return (
    <SidebarMenu className="gap-2">
      <SidebarLink
        href="/admin"
        icon={Shield}
        title={t.common.adminPanel}
        variant="admin"
      />
    </SidebarMenu>
  );
}

export function SidebarFooterLinksClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { t } = useLanguage();
  return (
    <SidebarMenu className="gap-2">
      {!isAuthenticated && (
        <SidebarLink
          href="/login"
          icon={LogIn}
          title={t.common.login}
        />
      )}
      <SidebarLink
        href="/settings"
        icon={Settings}
        title={t.common.settings}
      />
    </SidebarMenu>
  );
}
