"use client"

import { useState } from "react"
import { Sparkles, BookOpen } from "lucide-react"
import { IdeaGenerator } from "@/components/idea-generator"
import { CachedBooksLibrary } from "@/components/cached-books-library"
import { useLanguage } from "@/contexts/language-context"

export function LibraryTabs({ opportunities }: { opportunities: any[] }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");

  return (
    <div className="space-y-8">
      {/* Trocador de Abas Moderno (Glassmorphism Tabs) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-muted/40 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg">
          <button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "generator"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            {t.lib.tabGenerator}
          </button>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "history"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t.lib.tabHistory} ({opportunities.length})
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas com transições */}
      <div className="transition-all duration-500 ease-out">
        {activeTab === "generator" ? (
          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{t.lib.generatorHeader}</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                {t.lib.generatorDesc}
              </p>
            </div>
            <IdeaGenerator />
          </div>
        ) : (
          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <div className="text-center mb-8 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{t.lib.historyHeader}</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                {t.lib.historyDesc}
              </p>
            </div>
            <CachedBooksLibrary initialData={opportunities} />
          </div>
        )}
      </div>
    </div>
  );
}
