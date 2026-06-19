"use client";

import { motion } from "framer-motion";
import { Bell, Mail, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { NotificationSettings } from "@/hooks/use-settings";

interface Props {
  settings: NotificationSettings;
  onUpdate: (updates: Partial<NotificationSettings>) => void;
}

/* ------------------------------------------------------------------ */
/*  Custom Toggle Switch                                               */
/* ------------------------------------------------------------------ */

function ToggleSwitch({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-300 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${checked ? "bg-primary" : "bg-muted"}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
          transition-transform duration-300 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Row component for each toggle / slider item                        */
/* ------------------------------------------------------------------ */

function SettingRow({
  icon: Icon,
  iconColor,
  label,
  description,
  children,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  label: string;
  description: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.35, ease: "easeOut" }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card/40 border border-border/40 hover:border-border/70 hover:bg-card/60 transition-all duration-300"
    >
      {/* Icon */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconColor} text-white shadow-md`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Label + Description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {description}
        </p>
      </div>

      {/* Control */}
      <div className="shrink-0">{children}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SettingsNotifications({ settings, onUpdate }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-card rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* ── Gradient Header ─────────────────────────────────────── */}
      <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Notificações & Alertas
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure como e quando receber alertas de oportunidades
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="p-6 space-y-3">
        {/* 1 · Push Notifications */}
        <SettingRow
          icon={Bell}
          iconColor="from-amber-500 to-orange-600"
          label="Notificações Push"
          description="Receber alertas em tempo real no navegador"
          index={0}
        >
          <ToggleSwitch
            checked={settings.pushEnabled}
            onToggle={() => onUpdate({ pushEnabled: !settings.pushEnabled })}
          />
        </SettingRow>

        {/* 2 · Email Digest */}
        <SettingRow
          icon={Mail}
          iconColor="from-blue-500 to-cyan-600"
          label="Resumo Semanal por Email"
          description="Receber um resumo das melhores oportunidades toda semana"
          index={1}
        >
          <ToggleSwitch
            checked={settings.emailDigest}
            onToggle={() => onUpdate({ emailDigest: !settings.emailDigest })}
          />
        </SettingRow>

        {/* 3 · Score Alert Threshold (Slider) */}
        <SettingRow
          icon={Zap}
          iconColor="from-yellow-500 to-amber-600"
          label="Alerta de Score Alto"
          description="Notificar quando uma oportunidade ultrapassar este score"
          index={2}
        >
          <div className="flex items-center gap-3">
            <Badge
              variant={settings.scoreAlertThreshold === 0 ? "secondary" : "default"}
              className="min-w-[3.25rem] justify-center text-xs font-bold tabular-nums"
            >
              {settings.scoreAlertThreshold === 0
                ? "OFF"
                : settings.scoreAlertThreshold}
            </Badge>
          </div>
        </SettingRow>

        {/* Slider rendered below the row for better layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="px-4 pb-2"
        >
          <div className="relative group">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={settings.scoreAlertThreshold}
              onChange={(e) =>
                onUpdate({ scoreAlertThreshold: Number(e.target.value) })
              }
              className="
                w-full h-2 rounded-full appearance-none cursor-pointer
                bg-muted transition-all duration-200
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5
                [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-br
                [&::-webkit-slider-thumb]:from-amber-400
                [&::-webkit-slider-thumb]:to-orange-500
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:duration-200
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:appearance-none
                [&::-moz-range-thumb]:w-5
                [&::-moz-range-thumb]:h-5
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gradient-to-br
                [&::-moz-range-thumb]:from-amber-400
                [&::-moz-range-thumb]:to-orange-500
                [&::-moz-range-thumb]:shadow-lg
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white
                [&::-moz-range-thumb]:cursor-pointer
              "
              style={{
                background: `linear-gradient(to right, hsl(38 92% 50%) 0%, hsl(25 95% 53%) ${settings.scoreAlertThreshold}%, var(--app-muted) ${settings.scoreAlertThreshold}%, var(--app-muted) 100%)`,
              }}
            />
            <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground font-medium">
              <span>Desativado</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </motion.div>

        {/* 4 · New Opportunity Alert */}
        <SettingRow
          icon={Sparkles}
          iconColor="from-violet-500 to-purple-600"
          label="Novas Oportunidades"
          description="Alertar quando novas oportunidades forem detectadas no seu país padrão"
          index={3}
        >
          <ToggleSwitch
            checked={settings.newOpportunityAlert}
            onToggle={() =>
              onUpdate({ newOpportunityAlert: !settings.newOpportunityAlert })
            }
          />
        </SettingRow>
      </div>
    </motion.div>
  );
}
