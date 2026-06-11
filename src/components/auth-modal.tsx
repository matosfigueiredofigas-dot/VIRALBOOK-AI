"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Zap, Lock, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup" | "forgot";
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<"login" | "signup" | "forgot">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetState = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setMessage(null);
  };

  const changeTab = (newTab: "login" | "signup" | "forgot") => {
    setTab(newTab);
    setError(null);
    setMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message);
      } else {
        setMessage("Login efetuado com sucesso! Redirecionando...");
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else if (data.user && data.session === null) {
        setMessage("Cadastro realizado! Por favor, verifique seu e-mail para confirmar a conta.");
      } else {
        setMessage("Cadastro realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          onClose();
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      setError("Erro ao tentar cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      }
    } catch (err) {
      setError("Erro ao enviar e-mail de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Erro ao conectar com o Google.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!loading) {
            resetState();
            onClose();
          }
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-background/80 p-8 shadow-2xl backdrop-blur-2xl z-10"
      >
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20 mb-3">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">ViralBook AI</h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px]">
            {tab === "login" && "Acesse sua conta para visualizar o radar e salvar oportunidades."}
            {tab === "signup" && "Crie sua conta para acessar o gerador de ideias completo."}
            {tab === "forgot" && "Recupere o acesso à sua conta de forma segura."}
          </p>
        </div>

        {/* Tab Selector (only for Login & Signup) */}
        {tab !== "forgot" && (
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => changeTab("login")}
              disabled={loading}
              className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                tab === "login"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => changeTab("signup")}
              disabled={loading}
              className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                tab === "signup"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Contents */}
        <div className="min-h-[180px]">
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs text-muted-foreground font-semibold">Senha</Label>
                  <button
                    type="button"
                    onClick={() => changeTab("forgot")}
                    disabled={loading}
                    className="text-xs text-primary hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar na Plataforma"}
              </Button>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground font-semibold">Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground font-semibold">Confirmar Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Minha Conta"}
              </Button>
            </form>
          )}

          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar E-mail de Recuperação"}
              </Button>

              <button
                type="button"
                onClick={() => changeTab("login")}
                disabled={loading}
                className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors"
              >
                Voltar para o Login
              </button>
            </form>
          )}
        </div>

        {/* Divider (only for Login & Signup) */}
        {tab !== "forgot" && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121214] px-2 text-muted-foreground">Ou</span>
              </div>
            </div>

            {/* Google OAuth */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="secondary"
              className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold h-11 rounded-xl transition-all"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar com Google
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
