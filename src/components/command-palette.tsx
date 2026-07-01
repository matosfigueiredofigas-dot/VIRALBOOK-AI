"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Activity,
  BarChart3,
  Lightbulb,
  Globe,
  Users,
  Mail,
  Heart,
  Settings,
  Search,
  Moon,
  Sun,
  Home,
} from "lucide-react";
import { useTheme } from "next-themes";

interface CommandItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  action: () => void;
  group: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  const allCommands: CommandItem[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", description: "Visão geral do seu Radar", action: () => navigate("/dashboard"), group: "Navegação" },
    { id: "library", icon: Sparkles, label: "Biblioteca de Ideias", description: "Explore ideias geradas pela IA", action: () => navigate("/library"), group: "Navegação" },
    { id: "radar", icon: BookOpen, label: "Ebooks Radar", description: "Analise livros virais", action: () => navigate("/radar"), group: "Navegação" },
    { id: "niches", icon: Activity, label: "Emerging Niches", description: "Nichos emergentes de mercado", action: () => navigate("/niches"), group: "Navegação" },
    { id: "trends", icon: BarChart3, label: "Global Trends", description: "Tendências globais em tempo real", action: () => navigate("/trends"), group: "Navegação" },
    { id: "opportunities", icon: Lightbulb, label: "SaaS Opportunities", description: "Oportunidades validadas", action: () => navigate("/opportunities"), group: "Navegação" },
    { id: "landing", icon: Globe, label: "Landing Pages", description: "Gerador de landing pages", action: () => navigate("/landing-pages"), group: "Navegação" },
    { id: "advisors", icon: Users, label: "Conselho de Mentores", description: "Análise com mentores de IA", action: () => navigate("/advisors"), group: "Navegação" },
    { id: "email", icon: Mail, label: "Automação de E-mails", description: "Funil de e-mails automatizado", action: () => navigate("/email-funnel"), group: "Navegação" },
    { id: "favorites", icon: Heart, label: "Favoritos Salvos", description: "Seu cofre de nichos", action: () => navigate("/favorites"), group: "Conta" },
    { id: "settings", icon: Settings, label: "Configurações", description: "Ajustes da conta e preferências", action: () => navigate("/settings"), group: "Conta" },
    { id: "home", icon: Home, label: "Página Inicial", description: "Voltar para a landing page", action: () => navigate("/"), group: "Conta" },
    {
      id: "theme-dark",
      icon: Moon,
      label: "Tema Escuro",
      description: "Ativar modo escuro",
      action: () => { setTheme("dark"); onClose(); },
      group: "Aparência",
    },
    {
      id: "theme-light",
      icon: Sun,
      label: "Tema Claro",
      description: "Ativar modo claro",
      action: () => { setTheme("light"); onClose(); },
      group: "Aparência",
    },
  ];

  const filtered = query.trim()
    ? allCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          (c.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : allCommands;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        flatFiltered[selectedIndex].action();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, flatFiltered, selectedIndex, onClose]);

  if (!open) return null;

  let globalIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl mx-4 bg-popover border border-border/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "cmdSlideIn 0.15s ease-out" }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Buscar páginas, ações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/50 text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {flatFiltered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado para "{query}"
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {group}
              </div>
              {items.map((item) => {
                const itemIndex = globalIndex++;
                const isSelected = itemIndex === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <item.icon className={`h-3.5 w-3.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      )}
                    </div>
                    {isSelected && (
                      <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border/50 text-[10px] text-muted-foreground font-mono shrink-0">
                        ↵
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="font-mono px-1 border border-border/40 rounded text-[9px]">↑↓</kbd> Navegar</span>
            <span className="flex items-center gap-1"><kbd className="font-mono px-1 border border-border/40 rounded text-[9px]">↵</kbd> Selecionar</span>
          </div>
          <span>ViralBook AI</span>
        </div>
      </div>

      <style>{`
        @keyframes cmdSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
