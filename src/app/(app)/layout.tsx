import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CountrySelect } from "@/components/country-select";
import { TimeSelect } from "@/components/time-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-hidden flex flex-col relative z-0">
          <header className="h-16 flex items-center justify-between px-4 border-b border-border/40 shrink-0 bg-background/50 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Suspense fallback={<div className="h-9 w-[140px] bg-muted animate-pulse rounded-md"></div>}>
                <TimeSelect />
              </Suspense>
              <Suspense fallback={<div className="h-9 w-[180px] bg-muted animate-pulse rounded-md"></div>}>
                <CountrySelect />
              </Suspense>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
