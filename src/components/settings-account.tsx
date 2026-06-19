"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  User,
  Key,
  Download,
  Trash2,
  Shield,
  Crown,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  userEmail: string
}

export function SettingsAccount({ userEmail }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleExportData() {
    alert("Em breve disponível")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/15 text-primary">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Conta &amp; Segurança
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie seu perfil, senha e dados pessoais
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── 1. Profile Info ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Perfil
            </h3>
            <div className="flex items-center justify-between rounded-xl bg-muted/40 border border-border/40 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 text-primary shrink-0">
                  <User className="size-4" />
                </div>
                <span className="text-sm font-medium truncate">
                  {userEmail}
                </span>
              </div>
              <Badge className="gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25 shrink-0">
                <Crown className="size-3" />
                Pro
              </Badge>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* ── 2. Change Password ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Segurança
            </h3>
            <Button variant="outline" className="w-full justify-start gap-2" render={<Link href="/update-password" />}>
              <Key className="size-4" />
              Alterar Palavra-passe
            </Button>
          </div>

          <Separator className="opacity-50" />

          {/* ── 3. Export Data (GDPR) ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Privacidade &amp; Dados
            </h3>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleExportData}
            >
              <Download className="size-4" />
              Exportar Meus Dados
            </Button>
          </div>

          <Separator className="opacity-50" />

          {/* ── 4. Delete Account ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-destructive/80 uppercase tracking-wider">
              Zona Perigosa
            </h3>
            <div className="rounded-xl border border-destructive/20 bg-destructive/[0.04] p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Apagar Conta</p>
                  <p className="text-xs text-muted-foreground">
                    Remove permanentemente a sua conta e todos os dados
                    associados.
                  </p>
                </div>

                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger
                    render={
                      <Button
                        variant="destructive"
                        className="gap-2 shrink-0"
                      />
                    }
                  >
                    <Trash2 className="size-4" />
                    Apagar Conta
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tem certeza?</DialogTitle>
                      <DialogDescription>
                        Esta ação é irreversível. Todos os seus dados serão
                        permanentemente apagados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => setDeleteOpen(false)}
                      >
                        Sim, Apagar Conta
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* ── 5. Subscription Info ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Assinatura
            </h3>
            <div className="rounded-xl border border-border/40 bg-muted/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Plano</span>
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <Crown className="size-3.5 text-amber-500" />
                  ViralBook Pro
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado</span>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
                  Ativo
                </Badge>
              </div>
              <Separator className="opacity-40" />
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <ExternalLink className="size-3.5" />
                Gerir Assinatura
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
