"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextText: string;
  projectName: string;
}

export function AIChatModal({ isOpen, onClose, contextText, projectName }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá! Eu sou o CTO da sua nova startup baseada no "${projectName}". Do que você precisa? Nomes, código, estratégia de vendas?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Se fechar, podemos querer resetar as mensagens ou manter na sessão atual (vamos manter)

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const currentMessages = [...messages, userMessage].filter((m) => m.role === "user" || m.role === "assistant");
      // O primeiro do estado é assistente (boas vindas), o Groq não liga se a primeira for assistant.

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages,
          contextText,
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ops, ocorreu um erro de conexão. Tente novamente em instantes." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border/50 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right-full duration-300">
        
        {/* Header */}
        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Groq CTO</h3>
              <p className="text-xs text-muted-foreground">{projectName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                  : 'bg-muted/50 border border-border/50 rounded-tl-sm text-foreground'
              }`}>
                {msg.content}
              </div>
              
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center mt-1">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-background">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-muted/30 p-2 rounded-full border border-border/50 focus-within:border-primary/50 focus-within:bg-muted/50 transition-colors"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-transparent border-none outline-none text-sm px-4 text-foreground placeholder:text-muted-foreground"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4 ml-[-2px] mt-[2px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
