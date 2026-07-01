import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CountrySelect } from "@/components/country-select";
import { TimeSelect } from "@/components/time-select";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendTicker } from "@/components/trend-ticker";
import { CommandPaletteTrigger } from "@/components/command-palette-trigger";
import { QuickBookmark } from "@/components/quick-bookmark";
import { OnboardingTracker } from "@/components/onboarding-tracker";
import { ShareButton } from "@/components/share-button";
import { UserNav } from "@/components/user-nav";
import { Suspense } from "react";
import { createClient, getCachedUser } from "@/utils/supabase/server";
import { checkAdmin } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const isAdmin = await checkAdmin(supabase, user);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 h-svh overflow-hidden flex flex-col relative z-0">
          <header className="h-16 flex items-center justify-between px-4 border-b border-border/40 shrink-0 bg-background/50 backdrop-blur-md sticky top-0 z-10 gap-3">

            {/* ── LEFT: Sidebar toggle ── */}
            <div className="flex items-center gap-3 shrink-0">
              <SidebarTrigger />
            </div>

            {/* ── CENTER: Trend ticker + Command palette ── */}
            <div className="flex flex-1 items-center gap-3 min-w-0 overflow-hidden">
              <TrendTicker />
              <CommandPaletteTrigger />
            </div>

            {/* ── RIGHT: Quick actions + Filters + Profile ── */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Bookmark (contextual) */}
              <Suspense fallback={null}>
                <QuickBookmark />
              </Suspense>

              {/* Share / Export */}
              <ShareButton />

              {/* Divider */}
              <div className="hidden sm:block h-5 w-px bg-border/40" />

              {/* Filters */}
              <ThemeToggle />
              <Suspense fallback={<div className="h-8 w-[120px] bg-muted animate-pulse rounded-full" />}>
                <TimeSelect />
              </Suspense>
              <Suspense fallback={<div className="h-8 w-[150px] bg-muted animate-pulse rounded-full" />}>
                <CountrySelect />
              </Suspense>

              {/* Divider */}
              <div className="hidden sm:block h-5 w-px bg-border/40" />

              {/* Onboarding */}
              <OnboardingTracker />

              {/* User Nav */}
              <UserNav email={user.email ?? ""} isAdmin={isAdmin} />
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
