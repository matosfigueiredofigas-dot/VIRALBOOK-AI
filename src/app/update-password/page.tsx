"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, KeyRound, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(isEn ? "Password must be at least 6 characters." : isEs ? "La contraseña debe tener al menos 6 caracteres." : "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError(isEn ? "Passwords do not match." : isEs ? "Las contraseñas no coinciden." : "As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setError(isEn ? "An error occurred updating the password." : isEs ? "Ocurrió un error al actualizar la contraseña." : "Ocorreu um erro ao atualizar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-2 mb-6 z-10">
        <Zap className="h-8 w-8 text-primary" />
        <span className="font-bold text-2xl tracking-tight text-white">ViralBook AI</span>
      </div>

      <Card className="w-full max-w-md glass-card z-10 border-white/10 bg-background/65 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-extrabold text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            {isEn ? "New Password" : isEs ? "Nueva Contraseña" : "Nova Senha"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {isEn 
              ? "Enter your new password below to regain access to your account." 
              : isEs 
              ? "Ingrese su nueva contraseña para recuperar el acceso a su cuenta." 
              : "Digite sua nova senha abaixo para recuperar o acesso à sua conta."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4 py-4 text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto border border-green-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-white">
                {isEn ? "Password updated!" : isEs ? "¡Contraseña actualizada!" : "Senha atualizada!"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEn 
                  ? "Your password has been successfully reset. Redirecting to dashboard..." 
                  : isEs 
                  ? "Su contraseña se ha restablecido con éxito. Redirigiendo al panel..." 
                  : "Sua senha foi redefinida com sucesso. Redirecionando para o painel..."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{isEn ? "New Password" : isEs ? "Nueva Contraseña" : "Nova Senha"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isEn ? "Minimum 6 characters" : isEs ? "Mínimo 6 caracteres" : "Mínimo 6 caracteres"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-background/40 pr-10 border-white/10 text-white rounded-xl focus-visible:ring-primary h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{isEn ? "Confirm New Password" : isEs ? "Confirmar Nueva Contraseña" : "Confirmar Nova Senha"}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={isEn ? "Repeat new password" : isEs ? "Repita la nueva contraseña" : "Repita a nova senha"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background/40 border-white/10 text-white rounded-xl focus-visible:ring-primary h-11"
                />
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEn ? "Updating..." : isEs ? "Actualizando..." : "Atualizando..."}
                  </>
                ) : (
                  isEn ? "Update Password" : isEs ? "Actualizar Contraseña" : "Redefinir Senha"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
