"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistFormProps {
  landingPageId: string;
  ctaText: string;
  themeColor: string;
}

export function WaitlistForm({ landingPageId, ctaText, themeColor }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/landing-page/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, landingPageId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Algo deu errado. Tente novamente.");
      }

      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-center space-y-3 shadow-lg shadow-emerald-500/5"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="font-bold text-lg text-white">Inscrição confirmada!</h3>
            <p className="text-sm text-emerald-300/80">
              Você está na lista de espera. Entraremos em contato assim que o acesso ao beta for liberado!
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            layout
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Insira seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-zinc-900/50 border-zinc-800 text-white rounded-xl h-12 px-4 focus-visible:ring-1 focus-visible:ring-offset-0 placeholder:text-zinc-500 flex-grow"
                style={{
                  borderColor: error ? 'rgba(239, 68, 68, 0.4)' : undefined
                }}
              />
              <Button
                type="submit"
                disabled={loading}
                className="font-bold h-12 px-6 rounded-xl transition-all duration-300 text-white flex items-center justify-center gap-2 relative overflow-hidden group active:scale-95"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 4px 20px -2px ${themeColor}60`
                }}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {ctaText}
                    <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                  </>
                )}
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
