"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, DollarSign, Trash2 } from "lucide-react";

interface Opportunity {
  id: string;
  saas_name: string;
  problem_solved: string;
  target_audience: string;
  monetization_model: string;
  potential_revenue: string;
  implementation_difficulty: string;
}

export function OpportunitiesGrid({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
  const router = useRouter();
  const [opps, setOpps] = useState(initialOpportunities);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente a oportunidade "${name}"?`)) {
      const res = await fetch('/api/radar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        alert('Oportunidade excluída com sucesso!');
        setOpps(opps.filter(o => o.id !== id));
        router.refresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Erro ao excluir oportunidade.');
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {opps.map((opp, i) => (
        <Card key={opp.id || i} className="flex flex-col glass-card relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />
          <CardHeader className="relative z-10 pb-2">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                {opp.implementation_difficulty}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                onClick={() => handleDelete(opp.id, opp.saas_name)}
                title="Excluir Oportunidade"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-xl">{opp.saas_name}</CardTitle>
            <CardDescription className="line-clamp-3 text-muted-foreground mt-1">{opp.problem_solved}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto space-y-4 relative z-10 pt-4 border-t border-border/10">
            <div className="flex items-start gap-2 text-sm text-foreground/80">
              <Code className="h-4 w-4 mt-0.5 text-blue-400" />
              <span><strong>Público:</strong> {opp.target_audience}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-foreground/80">
              <DollarSign className="h-4 w-4 mt-0.5 text-green-500" />
              <span><strong>MRR Potencial:</strong> {opp.potential_revenue?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")} ({opp.monetization_model})</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {opps.length === 0 && (
        <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 border border-dashed border-border/50 rounded-2xl">
          Nenhuma oportunidade mapeada neste país.
        </div>
      )}
    </div>
  );
}
