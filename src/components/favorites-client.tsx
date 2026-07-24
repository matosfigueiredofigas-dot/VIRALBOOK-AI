"use client";

import { useLanguage } from "@/contexts/language-context";
import { OpportunitiesList } from "@/components/opportunities-list";
import { AdvancedFilters } from "@/components/advanced-filters";
import { Heart } from "lucide-react";

interface FavoritesClientProps {
  favorites: any[];
}

export function FavoritesClient({ favorites }: FavoritesClientProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent w-fit pb-1">
          <Heart className="h-8 w-8 text-red-500 fill-red-500/20" />
          {isEn ? "Saved Ideas" : isEs ? "Ideas Guardadas" : "Ideias Guardadas"}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {isEn 
            ? "Your vault of micro-SaaS opportunities. All the ideas you saved are right here." 
            : isEs 
            ? "Su bóveda de oportunidades de micro-SaaS. Todas las ideas que guardó están aquí." 
            : "O seu cofre de oportunidades de micro-SaaS. Todas as ideias que você salvou estão aqui."}
        </p>
      </div>

      <AdvancedFilters />

      {favorites.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border/50 rounded-xl bg-muted/20">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">
            {isEn ? "Your collection is empty" : isEs ? "Su colección está vacía" : "Sua coleção está vazia"}
          </h3>
          <p className="text-muted-foreground mt-2 mb-6">
            {isEn 
              ? "We couldn't find any saved opportunities matching these filters." 
              : isEs 
              ? "No encontramos ninguna oportunidad guardada que coincida con estos filtros." 
              : "Não encontramos nenhuma oportunidade salva que atenda a esses filtros."}
          </p>
        </div>
      ) : (
        <OpportunitiesList initialData={favorites} hideSearch={true} />
      )}
    </div>
  );
}
