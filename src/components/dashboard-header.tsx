"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Zap, TrendingUp, Globe, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardHeaderProps {
  country: string;
  time: string;
  totalOpps: number;
  avgScore: number;
}

export function DashboardHeader({ country, time, totalOpps, avgScore }: DashboardHeaderProps) {
  const { t, language } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const countryLabel = country === 'ALL' ? t.dash.allCountries : country;
  
  const isEn = language === 'en';
  const isEs = language === 'es';
  const hideText = isEn ? "Hide Stats" : isEs ? "Ocultar" : "Ocultar";
  const showText = isEn ? "Show Stats" : isEs ? "Mostrar" : "Mostrar";

  return (
    <div className="space-y-6">
      {/* Title & Top CTAs */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent w-fit pb-1">
            {t.dash.title}
          </h1>
          {!isCollapsed && (
            <p className="text-muted-foreground mt-2 text-lg">
              {t.dash.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 py-2 cursor-pointer transition-colors"
            title={isCollapsed ? showText : hideText}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            <span className="hidden sm:inline">{isCollapsed ? showText : hideText}</span>
          </button>

          <a href="/welcome">
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
              <Zap className="h-4 w-4" />
              {t.dash.watchTutorial}
            </div>
          </a>
          <a href={`/api/export/csv?country=${country}&time=${time}`} download>
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
              <Zap className="h-4 w-4" />
              {t.dash.exportCsv}
            </div>
          </a>
        </div>
      </div>

      {/* Summary Cards */}
      {!isCollapsed && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dash.saasOpportunities} ({countryLabel})</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOpps}</div>
            </CardContent>
          </Card>
  
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dash.avgScore}</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgScore}</div>
            </CardContent>
          </Card>
  
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.dash.targetMarket}</CardTitle>
              <Globe className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-xl md:text-2xl">{countryLabel}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
