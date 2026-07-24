"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sparkles, Zap, Lock, Mail, KeyRound, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';
  
  const [tab, setTab] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check session client-side
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      } else {
        setCheckingSession(false);
      }
    });

    const msg = searchParams.get("message");
    if (msg) {
      setMessage(msg);
    }
  }, [router, searchParams, supabase.auth]);

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

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || (isEn ? "Failed to sign in" : isEs ? "Error al iniciar sesión" : "Falha ao fazer login"));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError(isEn ? "Passwords do not match" : isEs ? "Las contraseñas no coinciden" : "As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError(isEn ? "Password must be at least 6 characters" : isEs ? "La contraseña debe tener al menos 6 caracteres" : "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage(isEn ? "Account created! Check your email to confirm registration." : isEs ? "¡Cuenta creada! Revise su correo para confirmar el registro." : "Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.");
      setTab("login");
    } catch (err: any) {
      setError(err.message || (isEn ? "Failed to create account" : isEs ? "Error al crear cuenta" : "Falha ao criar conta"));
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
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setMessage(isEn ? "Password reset link sent to your email." : isEs ? "Enlace de recuperación enviado a su correo." : "E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError(err.message || (isEn ? "Failed to send reset link" : isEs ? "Error al enviar enlace" : "Falha ao enviar e-mail de recuperação"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || (isEn ? "Google login failed" : isEs ? "Error en inicio con Google" : "Falha na autenticação com o Google"));
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">{isEn ? "Loading..." : isEs ? "Cargando..." : "Carregando..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 z-10">
        <Zap className="h-8 w-8 text-primary" />
        <span className="font-bold text-2xl tracking-tight text-white">ViralBook AI</span>
      </div>

      <Card className="w-full max-w-md glass-card z-10 border-white/10 bg-background/65 backdrop-blur-xl shadow-2xl rounded-[30px] p-2">
        <CardHeader className="space-y-1 pb-4 text-center">
          <CardTitle className="text-2xl font-black text-white">
            {tab === "login" && (isEn ? "Welcome back" : isEs ? "Bienvenido de nuevo" : "Bem-vindo de volta")}
            {tab === "signup" && (isEn ? "Create new account" : isEs ? "Crear nueva cuenta" : "Criar nova conta")}
            {tab === "forgot" && (isEn ? "Reset password" : isEs ? "Recuperar contraseña" : "Recuperar senha")}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {tab === "login" && (isEn ? "Sign in to access your ideas and opportunities." : isEs ? "Acceda a su cuenta para ver sus ideas y oportunidades." : "Acesse sua conta para ver suas ideias e oportunidades.")}
            {tab === "signup" && (isEn ? "Sign up to start using the micro-SaaS radar." : isEs ? "Regístrese para empezar a usar el radar de micro-SaaS." : "Cadastre-se para começar a usar o radar de micro-SaaS.")}
            {tab === "forgot" && (isEn ? "Enter your email to receive recovery instructions." : isEs ? "Ingrese su correo para recibir instrucciones de recuperación." : "Insira seu e-mail para receber as instruções de recuperação.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab Selector (only for Login & Signup) */}
          {tab !== "forgot" && (
            <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/5 mb-2">
              <button
                onClick={() => changeTab("login")}
                disabled={loading}
                className={`py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                  tab === "login"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {t.common.login}
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
                {isEn ? "Sign Up" : isEs ? "Registrarse" : "Criar Conta"}
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
                className="overflow-hidden"
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
                className="overflow-hidden"
              >
                <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2">
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-xs text-muted-foreground font-semibold">{isEn ? "Password" : isEs ? "Contraseña" : "Senha"}</Label>
                    <button
                      type="button"
                      onClick={() => changeTab("forgot")}
                      disabled={loading}
                      className="text-xs text-primary hover:underline"
                    >
                      {isEn ? "Forgot password?" : isEs ? "¿Olvidó su contraseña?" : "Esqueceu a senha?"}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEn ? "Sign In" : isEs ? "Iniciar Sesión" : "Entrar na Plataforma")}
                </Button>
              </form>
            )}

            {tab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs text-muted-foreground font-semibold">{isEn ? "Password" : isEs ? "Contraseña" : "Senha"}</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={isEn ? "Min 6 characters" : isEs ? "Mínimo 6 caracteres" : "Mínimo 6 caracteres"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground font-semibold">{isEn ? "Confirm Password" : isEs ? "Confirmar Contraseña" : "Confirmar Senha"}</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder={isEn ? "Repeat your password" : isEs ? "Repita su contraseña" : "Repita sua senha"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEn ? "Create Account" : isEs ? "Crear Cuenta" : "Criar Minha Conta")}
                </Button>
              </form>
            )}

            {tab === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-muted-foreground font-semibold">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="bg-background/40 border-white/10 text-white rounded-xl pl-10 focus-visible:ring-primary h-11"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEn ? "Send Recovery Link" : isEs ? "Enviar Enlace de Recuperación" : "Enviar E-mail de Recuperação")}
                </Button>

                <button
                  type="button"
                  onClick={() => changeTab("login")}
                  disabled={loading}
                  className="w-full text-center text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  {isEn ? "Back to Sign In" : isEs ? "Volver a Iniciar Sesión" : "Voltar para o Login"}
                </button>
              </form>
            )}
          </div>

          {/* Divider (only for Login & Signup) */}
          {tab !== "forgot" && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#121214] px-2 text-muted-foreground">{isEn ? "Or" : isEs ? "O" : "Ou"}</span>
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
                {isEn ? "Continue with Google" : isEs ? "Continuar con Google" : "Continuar com Google"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Verificando sessão...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
