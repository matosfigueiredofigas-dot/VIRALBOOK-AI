import Link from "next/link";
import { Book, LayoutDashboard, Search, Zap, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Lateral para a Documentação */}
      <aside className="w-64 border-r border-border/50 bg-background/50 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">ViralBook Docs</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Guia Rápido</h4>
            <div className="space-y-1">
              <Link href="/docs#introducao" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted text-foreground font-medium">
                <Book className="h-4 w-4 text-muted-foreground" />
                Introdução
              </Link>
              <Link href="/docs#radar" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted text-foreground font-medium">
                <Search className="h-4 w-4 text-muted-foreground" />
                Como usar o Radar
              </Link>
              <Link href="/docs#oportunidades" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted text-foreground font-medium">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Oportunidades SaaS
              </Link>
              <Link href="/docs#favoritos" className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted text-foreground font-medium">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                Salvando Favoritos
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <Link href="/login" className="flex items-center justify-center w-full py-2 bg-primary/10 text-primary rounded-md text-sm font-bold hover:bg-primary/20 transition-colors">
            Acessar o App
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10 md:justify-end">
          <div className="md:hidden flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold">Docs</span>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
