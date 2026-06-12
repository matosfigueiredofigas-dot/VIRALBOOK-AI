import { TrendingUp, User, LogOut } from "lucide-react"
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
import { 
  SidebarMenuClient, 
  SidebarMyAccountClient, 
  SidebarAdminClient, 
  SidebarFooterLinksClient 
} from "@/components/sidebar-menu-client"

export async function AppSidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    if (user.email === 'moisesdematos@gmail.com') {
      isAdmin = true
    } else {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role === 'admin') {
          isAdmin = true
        }
      } catch (e) {
        // Silently catch error if database table doesn't exist
      }
    }
  }

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
        {/* Menu Principal & Comece por Aqui (Gerenciados Client-side para Active States) */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuClient />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Minha Conta (Favoritos) */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">Minha Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMyAccountClient />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Painel Administrativo */}
        {isAdmin && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase mb-2">Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarAdminClient isAdmin={isAdmin} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Rodapé do Menu (Perfil, Configurações e Auth) */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            {user ? (
              <>
                <SidebarMenu className="gap-2 mb-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      render={<div className="flex items-center gap-3 px-3" />}
                      className="h-11 bg-primary/5 hover:bg-primary/10 transition-all rounded-lg group mb-1"
                    >
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-medium text-sm text-foreground truncate" title={user.email}>{user.email}</span>
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
                </SidebarMenu>
                <SidebarFooterLinksClient isAuthenticated={true} />
              </>
            ) : (
              <SidebarFooterLinksClient isAuthenticated={false} />
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
