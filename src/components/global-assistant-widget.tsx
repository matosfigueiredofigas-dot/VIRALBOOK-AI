"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Paperclip, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface ActionButton {
  label: string;
  url: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  suggested_actions?: ActionButton[];
}

export function GlobalAssistantWidget() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const isEn = language === 'en';
  const isEs = language === 'es';

  const initialGreeting = isEn 
    ? "Hi! I'm ViralBot, your Virtual Assistant. How can I help you dominate the market today?" 
    : isEs 
    ? "¡Hola! Soy ViralBot, tu Asistente Virtual. ¿Cómo puedo ayudarte a dominar el mercado hoy?" 
    : "Olá! Sou o ViralBot, o seu Assistente Virtual. Como posso ajudar-lhe a dominar o mercado hoje?";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    loadChatHistory();
  }, []);

  async function loadChatHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('viralbot_chats')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (data && data.length > 0) {
        setMessages(data.map(d => ({ role: d.role as any, content: d.content })));
      } else {
        setMessages([{ role: "assistant", content: initialGreeting }]);
      }
    } else {
      setMessages([{ role: "assistant", content: initialGreeting }]);
    }
  }

  async function saveMessage(role: string, content: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('viralbot_chats').insert([{ user_id: user.id, role, content }]);
    }
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.text) {
          setPdfText(data.text);
        }
      } catch (err) {
        console.error("Erro ao ler PDF", err);
      }
    }
  };

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    let userContent = input;
    if (pdfText) {
      userContent = `[PDF Anexado: ${pdfFile?.name}]\n\nConteúdo do PDF:\n${pdfText}\n\nMensagem do Utilizador:\n${input}`;
    }

    const userMessage: Message = { role: "user", content: input }; // Mostrar só o input curto na UI
    setMessages((prev) => [...prev, userMessage]);
    saveMessage("user", input);
    
    setInput("");
    setPdfFile(null);
    setPdfText("");
    setIsLoading(true);

    try {
      const pageContent = document.body.innerText.slice(0, 5000);
      
      // Construir histórico para enviar à IA (incluindo o texto do PDF na última mensagem)
      const messagesToSend = messages.map(m => ({ role: m.role, content: m.content }));
      messagesToSend.push({ role: "user", content: userContent });

      const res = await fetch("/api/chat-global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend,
          url: window.location.href,
          pageContent,
          language
        }),
      });

      if (!res.ok) throw new Error("Erro na resposta da IA");
      
      const data = await res.json();
      
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.reply,
        suggested_actions: data.suggested_actions
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      saveMessage("assistant", data.reply);

      // AÇÃO AGENTIC: Auto-Builder Chain
      if (data.trigger_auto_builder) {
        executeAutoBuilderSequence(data.trigger_auto_builder);
      } else if (data.auto_navigate_to) {
        setTimeout(() => {
          router.push(data.auto_navigate_to);
        }, 1500); 
      }

    } catch (error) {
      console.error(error);
      const errorMsg = isEn ? "Oops, I lost connection to the server." : (isEs ? "Uy, perdí la conexión." : "Oops, perdi a ligação.");
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function executeAutoBuilderSequence(keyword: string) {
    setIsLoading(true);
    let currentStatus = isEn ? "Starting radar..." : "A iniciar o radar...";
    
    // Add a status message that we will update
    const statusMsgId = Date.now().toString();
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: `🚀 **Auto-Builder Ativado:**\n\n⏳ A analisar mercado e criar SaaS para: "${keyword}"...` 
    }]);

    try {
      // 1. Radar
      const radarRes = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, country: 'ALL', targetLanguage: language })
      });
      const radarData = await radarRes.json();
      
      if (!radarRes.ok || !radarData.data?.id) throw new Error("Falha no Radar");
      const oppId = radarData.data.id;
      const saasName = radarData.data.saas_name || "Startup AI";
      const problem = radarData.data.pain_points?.[0] || "Otimização de rotinas";
      const audience = radarData.data.target_audience?.[0] || "Público Geral";
      const features = radarData.data.features || ["Automação", "Dashboard"];

      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = `🚀 **Auto-Builder Ativado:**\n\n✅ Ideia gerada: ${saasName}\n⏳ A construir Landing Page...`;
        return newArr;
      });

      // 2. Landing Page
      await fetch("/api/opportunities/launchpad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          opportunityId: oppId, 
          saasName, problem, audience, features: features.join(", "),
          language 
        })
      });

      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = `🚀 **Auto-Builder Ativado:**\n\n✅ Landing Page construída\n⏳ A escrever campanhas de anúncios...`;
        return newArr;
      });

      // 3. Ads
      await fetch("/api/opportunities/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: oppId, language })
      });

      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = `🚀 **Auto-Builder Ativado:**\n\n✅ Anúncios prontos\n⏳ A gerar Email Funnel...`;
        return newArr;
      });

      // 4. Emails
      await fetch("/api/opportunities/email-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: oppId, language })
      });

      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = `🚀 **Auto-Builder Concluído!** 🎉\n\nO seu Micro-SaaS **${saasName}** foi construído com sucesso. A redirecionar para os resultados...`;
        return newArr;
      });

      setTimeout(() => {
        router.push(`/favorites`);
      }, 2500);

    } catch (error) {
      console.error("Auto builder error", error);
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1].content = `❌ Erro no Auto-Builder. Não foi possível concluir a operação de forma automática. Tente fazer a pesquisa pelo menu Radar.`;
        return newArr;
      });
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
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground rounded-br-sm shadow-md" 
                      : "bg-muted/50 border border-border/50 text-foreground rounded-bl-sm"
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {msg.content.split('\\n').map((line, idx) => (
                        <p key={idx} className="my-1">{line}</p>
                      ))}
                    </div>
                  </div>
                  
                  {/* Agentic UI Buttons */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2 w-full max-w-[85%] pl-2">
                      {msg.suggested_actions.map((action, idx) => (
                        <Link 
                          key={idx} 
                          href={action.url}
                          className="w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 text-sm font-semibold transition-all">
                            <Sparkles className="h-4 w-4" />
                            {action.label}
                          </button>
                        </Link>
                      ))}
                    </div>
                  )}
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

            {/* Area de Anexo */}
            {pdfFile && (
              <div className="px-4 py-2 bg-indigo-500/10 border-t border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold truncate">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{pdfFile.name}</span>
                </div>
                <button onClick={() => { setPdfFile(null); setPdfText(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-background">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 relative"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isEn ? "Ask me anything..." : (isEs ? "Pregúntame cualquier cosa..." : "Pergunte-me qualquer coisa...")}
                    className="w-full bg-muted/50 border border-border rounded-full pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    disabled={isLoading}
                  />
                  {/* Botão de Upload de PDF */}
                  <div className="absolute left-1 top-1/2 -translate-y-1/2">
                    <input
                      type="file"
                      accept=".pdf"
                      id="pdf-upload"
                      className="hidden"
                      onChange={handlePdfUpload}
                    />
                    <label htmlFor="pdf-upload" className="p-2 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer transition-colors">
                      <Paperclip className="h-4 w-4" />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm shrink-0"
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
