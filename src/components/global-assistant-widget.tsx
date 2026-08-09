"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function GlobalAssistantWidget() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isEn = language === 'en';
  const isEs = language === 'es';

  // O contexto traduzido dependendo do idioma
  const initialGreeting = isEn 
    ? "Hi! I'm ViralBot, your Virtual Assistant. How can I help you dominate the market today?" 
    : isEs 
    ? "¡Hola! Soy ViralBot, tu Asistente Virtual. ¿Cómo puedo ayudarte a dominar el mercado hoy?" 
    : "Olá! Sou o ViralBot, o seu Assistente Virtual. Como posso ajudar-lhe a dominar o mercado hoje?";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Inicializar mensagem se não houver
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: initialGreeting }]);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const currentMessages = [...messages, userMessage];

      // Capturar o texto da página atual de forma segura (limitado a 5000 caracteres para não estourar o limite de tokens)
      const pageContent = document.body.innerText.slice(0, 5000);

      const res = await fetch("/api/chat-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          url: window.location.href,
          pageContent,
          language
        }),
      });

      if (!res.ok) throw new Error("Erro na resposta da IA");
      
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      const errorMsg = isEn ? "Oops, I lost connection to the server. Can you try again?" : (isEs ? "Uy, perdí la conexión con el servidor. ¿Puedes intentarlo de nuevo?" : "Oops, perdi a ligação ao servidor. Pode tentar novamente?");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:scale-110 transition-transform duration-300 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Abrir Assistente Virtual"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Modal / Sidebar Chat */}
      {isOpen && createPortal(
        <>
          {/* Overlay invisível ou levemente escurecido */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-background border-l border-border/50 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right-full duration-300">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">ViralBot</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-md" 
                      : "bg-muted/50 border border-border/50 text-foreground rounded-bl-sm"
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {msg.content.split('\n').map((line, idx) => (
                        <p key={idx} className="my-1">{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in">
                  <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isEn ? "Ask me anything..." : (isEs ? "Pregúntame cualquier cosa..." : "Pergunte-me qualquer coisa...")}
                  className="flex-1 bg-muted/50 border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
