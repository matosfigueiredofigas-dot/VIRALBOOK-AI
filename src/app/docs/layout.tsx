import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsHeader } from "@/components/docs/docs-header";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Lateral reativa para a Documentação */}
      <DocsSidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        <DocsHeader />
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

