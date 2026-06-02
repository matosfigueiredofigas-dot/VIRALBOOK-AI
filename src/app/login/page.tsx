import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-12 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-6 mx-auto">
        <Zap className="h-8 w-8 text-primary" />
        <span className="font-bold text-2xl tracking-tight">ViralBook AI</span>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Bem-vindo de volta</CardTitle>
          <CardDescription>
            Faça login para salvar suas oportunidades favoritas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="bg-background/50"
              />
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <Button type="submit" formAction="/api/auth/login" formMethod="post" variant="default" className="w-full">
                Entrar
              </Button>
              <Button type="submit" formAction="/api/auth/signup" formMethod="post" variant="outline" className="w-full bg-transparent">
                Criar conta
              </Button>
            </div>
            
            {/* Opcional: Login com Google - requer setup no Supabase */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
            
            <Button type="submit" formAction="/api/auth/google" formMethod="post" variant="secondary" className="w-full">
              Continuar com Google
            </Button>
            
            {searchParams?.message && (
              <p className="mt-4 p-4 bg-muted/50 text-foreground text-center text-sm rounded-md border border-border">
                {searchParams.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
