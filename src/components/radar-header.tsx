"use client";

import { useLanguage } from "@/contexts/language-context";
import { BookOpen } from "lucide-react";

export function RadarHeader({ country }: { country: string }) {
  const { t } = useLanguage();

  const countryLabel = country === 'ALL' ? t.dash.allCountries : country;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-indigo-500" />
        {t.radar.title}
      </h1>
      <p className="text-muted-foreground mt-2">
        {t.radar.subtitle} ({countryLabel})
      </p>
    </div>
  );
}
