"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Brain, 
  Globe, 
  Bell, 
  Shield, 
  RotateCcw,
  CheckCircle2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/use-settings";
import { SettingsAppearance } from "@/components/settings-appearance";
import { SettingsAIEngine } from "@/components/settings-ai-engine";
import { SettingsMarket } from "@/components/settings-market";
import { SettingsNotifications } from "@/components/settings-notifications";
import { SettingsAccount } from "@/components/settings-account";

const tabs = [
  { id: "appearance", label: "Aparência", icon: Palette, color: "from-violet-500 to-purple-600" },
  { id: "ai-engine", label: "Motor de IA", icon: Brain, color: "from-emerald-500 to-teal-600" },
  { id: "market", label: "Mercado", icon: Globe, color: "from-blue-500 to-cyan-600" },
  { id: "notifications", label: "Notificações", icon: Bell, color: "from-amber-500 to-orange-600" },
  { id: "account", label: "Conta", icon: Shield, color: "from-rose-500 to-red-600" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface SettingsClientProps {
  userEmail: string;
}

export function SettingsClient({ userEmail }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("appearance");
  const { settings, loaded, updateSettings, resetSection, resetAll } = useSettings();
  const [showSaved, setShowSaved] = useState(false);

  const handleSaveFlash = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  if (!loaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-xl" />
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent w-fit pb-1 flex items-center gap-3">
            <Settings className="h-9 w-9 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Personalize o ViralBook AI ao seu estilo e necessidades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Saved indicator */}
          <AnimatePresence>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-1.5 text-emerald-500 text-sm font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Salvo!
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetAll();
              handleSaveFlash();
            }}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Repor Tudo
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-muted/50 rounded-2xl border border-border/40 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer
                ${isActive 
                  ? "bg-card text-foreground shadow-md border border-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }
              `}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br ${tab.color} text-white`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-xl border-2 border-primary/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {activeTab === "appearance" && (
            <SettingsAppearance
              settings={settings.appearance}
              onUpdate={(updates) => {
                updateSettings("appearance", updates);
                handleSaveFlash();
              }}
            />
          )}
          {activeTab === "ai-engine" && (
            <SettingsAIEngine
              settings={settings.aiEngine}
              onUpdate={(updates) => {
                updateSettings("aiEngine", updates);
                handleSaveFlash();
              }}
            />
          )}
          {activeTab === "market" && (
            <SettingsMarket
              settings={settings.market}
              onUpdate={(updates) => {
                updateSettings("market", updates);
                handleSaveFlash();
              }}
            />
          )}
          {activeTab === "notifications" && (
            <SettingsNotifications
              settings={settings.notifications}
              onUpdate={(updates) => {
                updateSettings("notifications", updates);
                handleSaveFlash();
              }}
            />
          )}
          {activeTab === "account" && (
            <SettingsAccount userEmail={userEmail} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
