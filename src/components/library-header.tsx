"use client";

import { useLanguage } from "@/contexts/language-context";
import { Sparkles } from "lucide-react";

export function LibraryHeader() {
  const { t } = useLanguage();

  return (
    <div className="text-center space-y-4">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-xl shadow-primary/20 mb-2">
        <Sparkles className="h-8 w-8" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-indigo-500 bg-clip-text text-transparent pb-2">
        {t.lib.title}
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {t.lib.subtitle}
      </p>
    </div>
  );
}
