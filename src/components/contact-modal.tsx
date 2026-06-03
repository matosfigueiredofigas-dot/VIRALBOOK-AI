"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => {
          setSuccess(false);
          setIsOpen(false);
        }, 2500);
      } else {
        alert("Ops, ocorreu um erro ao enviar sua mensagem. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 cursor-pointer" />}>
        <Mail className="h-4 w-4" /> Enviar Mensagem de Suporte
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background border-border/50 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Enviar Mensagem</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Tem alguma dúvida ou encontrou um problema? Envie uma mensagem que nosso suporte responderá em até 24 horas úteis.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-3 animate-in zoom-in duration-300">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
            <h4 className="font-bold text-lg">Mensagem Enviada!</h4>
            <p className="text-sm text-muted-foreground">Obrigado. Nosso time já foi notificado.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nome Completo</label>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: João Silva" 
                required 
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">E-mail de Contato</label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Ex: joao@email.com" 
                required 
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Como podemos ajudar?</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Descreva sua dúvida, sugestão ou feedback de forma clara..." 
                rows={4} 
                required 
                disabled={loading}
                className="flex min-h-[80px] w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-10 mt-2 font-bold shadow-lg shadow-primary/20">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar Mensagem"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
