import { BookOpen, TrendingUp, Lightbulb, Activity, BarChart3, Settings, Heart, LogIn, Sparkles, LayoutDashboard, PlayCircle, User, LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "SaaS Opportunities",
    url: "/opportunities",
    icon: Lightbulb,
  },
  {
    title: "Biblioteca de Ideias",
    url: "/library",
    icon: Sparkles,
  },
  {
    title: "Emerging Niches",
    url: "/niches",
    icon: Activity,
  },
  {
    title: "Ebooks Radar",
    url: "/radar",
    icon: BookOpen,
  },
  {
    title: "Global Trends",
    url: "/trends",
    icon: BarChart3,
  },
]

export async function AppSidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Sidebar className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
      <SidebarHeader className="h-20 flex items-center px-6 justify-center">
        <a href="/" className="flex items-center gap-3 w-full p-2 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-xl border border-border/50 shadow-inner hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
            <TrendingUp className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">ViralBook</span>
        </a>
      </SidebarHeader>
      
      <SidebarSeparator className="bg-border/50 mx-4" />
      
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-12 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all rounded-lg group border border-primary/20 mb-4 shadow-sm shadow-primary/5">
                  <a href="/welcome" className="flex items-center gap-3 px-3">
                    <PlayCircle className="h-5 w-5" />
                    <span className="font-bold text-sm">Comece por Aqui</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 hover:bg-primary/10 hover:text-primary transition-all rounded-lg group">
                    <a href={item.url} className="flex items-center gap-3 px-3">
                      <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">Minha Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg group">
                  <a href="/favorites" className="flex items-center gap-3 px-3">
                    <Heart className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                    <span className="font-medium text-sm">Favoritos Salvos</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {user ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="h-11 bg-primary/5 hover:bg-primary/10 transition-all rounded-lg group mb-1">
                      <div className="flex items-center gap-3 px-3">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium text-sm text-foreground truncate" title={user.email}>{user.email}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <form action="/api/auth/logout" method="post">
                      <SidebarMenuButton type="submit" className="h-11 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg group w-full text-left">
                        <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                        <span className="font-medium text-sm">Sair da Conta</span>
                      </SidebarMenuButton>
                    </form>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-11 hover:bg-muted transition-all rounded-lg group">
                    <a href="/login" className="flex items-center gap-3 px-3">
                      <LogIn className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="font-medium text-sm">Login / Autenticação</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-11 hover:bg-muted transition-all rounded-lg group">
                  <a href="/settings" className="flex items-center gap-3 px-3">
                    <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="font-medium text-sm">Configurações</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
