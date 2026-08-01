import Link from "next/link";
import { BookOpen, LayoutDashboard, Zap, ArrowLeft, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCachedUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const chapters = [
    { id: "capitulo-1", title: "Capítulo 1: História & Metodologia" },
    { id: "capitulo-2", title: "Capítulo 2: Arquitetura & UX" },
    { id: "capitulo-3", title: "Capítulo 3: Módulos & Botões" },
    { id: "capitulo-4", title: "Capítulo 4: Geração de Ideias" },
    { id: "capitulo-5", title: "Capítulo 5: Validação Científica" },
    { id: "capitulo-6", title: "Capítulo 6: Transformando em SaaS" },
    { id: "capitulo-7", title: "Capítulo 7: Conselho de 8 Mentores" },
    { id: "capitulo-8", title: "Capítulo 8: Roadmap de 30 Dias" },
    { id: "capitulo-9", title: "Capítulo 9: Prompts & IA Avançada" },
    { id: "capitulo-10", title: "Capítulo 10: Estudos de Caso" },
    { id: "capitulo-11", title: "Capítulo 11: FAQ & Limitações" },
    { id: "capitulo-12", title: "Capítulo 12: Checklist de Lançamento" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Lateral para a Documentação */}
      <aside className="w-72 border-r border-border/50 bg-card/60 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-20 flex items-center px-6 border-b border-border/50 shrink-0 gap-3">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight">ViralBook AI</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Manual Oficial</span>
            </div>
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center justify-between px-2 mb-3">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Índice do Livro</h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary">12 Capítulos</span>
            </div>
            <div className="space-y-1">
              <Link href="/docs#prefacio" className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted text-foreground font-medium transition-colors">
                <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                Prefácio & Introdução
              </Link>
              {chapters.map((cap) => (
                <Link 
                  key={cap.id} 
                  href={`/docs#${cap.id}`} 
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors truncate"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0"></span>
                  <span className="truncate">{cap.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md">
            <LayoutDashboard className="h-4 w-4" />
            Voltar ao Dashboard
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="md:hidden flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Documentação Oficial e Manual de Operação do ViralBook AI</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
