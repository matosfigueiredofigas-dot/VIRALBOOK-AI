import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configurações do sistema e gerenciamento do robô de automação.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Painel do Motor de IA</CardTitle>
          <CardDescription>
            Em breve: Interface para você alterar o peso do 'Viral Opportunity Score' diretamente por aqui, sem precisar alterar o código.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center text-muted-foreground border-t border-dashed">
          Configurações em desenvolvimento...
        </CardContent>
      </Card>
    </div>
  )
}
