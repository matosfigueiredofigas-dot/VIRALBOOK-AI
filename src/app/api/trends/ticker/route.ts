import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const revalidate = 300; // Cache por 5 minutos

export async function GET() {
  try {
    const supabase = await createClient();

    // Buscar categorias com mais oportunidades e maior score médio
    const { data, error } = await supabase
      .from("opportunities")
      .select("book_category, viral_opportunity_score, trends_growth_weekly, trends_growth_monthly")
      .not("book_category", "is", null)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;

    // Agrupar por categoria e calcular métricas
    const categoryMap: Record<string, {
      count: number;
      totalScore: number;
      totalGrowthWeekly: number;
      totalGrowthMonthly: number;
      countWithGrowth: number;
    }> = {};

    for (const row of data ?? []) {
      const cat = row.book_category?.trim();
      if (!cat) continue;

      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, totalScore: 0, totalGrowthWeekly: 0, totalGrowthMonthly: 0, countWithGrowth: 0 };
      }

      categoryMap[cat].count++;
      categoryMap[cat].totalScore += row.viral_opportunity_score ?? 0;

      if (row.trends_growth_weekly != null) {
        categoryMap[cat].totalGrowthWeekly += row.trends_growth_weekly;
        categoryMap[cat].countWithGrowth++;
      }
      if (row.trends_growth_monthly != null) {
        categoryMap[cat].totalGrowthMonthly += row.trends_growth_monthly;
      }
    }

    // Transformar em array e ordenar por score médio
    const trends = Object.entries(categoryMap)
      .map(([category, stats]) => ({
        label: category,
        count: stats.count,
        avgScore: Math.round(stats.totalScore / stats.count),
        avgGrowthWeekly: stats.countWithGrowth > 0
          ? Math.round((stats.totalGrowthWeekly / stats.countWithGrowth) * 10) / 10
          : null,
        avgGrowthMonthly: stats.countWithGrowth > 0
          ? Math.round((stats.totalGrowthMonthly / stats.countWithGrowth) * 10) / 10
          : null,
        // Determinar tendência com base no score e count
        up: stats.totalScore / stats.count >= 50,
        // Formatar o número de mudança
        change: stats.countWithGrowth > 0
          ? `${stats.totalGrowthWeekly / stats.countWithGrowth >= 0 ? "+" : ""}${Math.round(stats.totalGrowthWeekly / stats.countWithGrowth)}%`
          : `${stats.count} oportunidades`,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 12);

    // Se não houver dados suficientes, retornar fallback
    if (trends.length < 3) {
      return NextResponse.json({ trends: getFallbackTrends() });
    }

    return NextResponse.json({ trends });
  } catch (err) {
    console.error("[trend-ticker] erro:", err);
    return NextResponse.json({ trends: getFallbackTrends() });
  }
}

function getFallbackTrends() {
  return [
    { label: "SaaS B2B Produtividade", change: "+18%", up: true },
    { label: "Apps para TDAH", change: "+124%", up: true },
    { label: "Finanças Pessoais", change: "+31%", up: true },
    { label: "Ferramentas para Criadores", change: "+47%", up: true },
    { label: "Micro-SaaS para Médicos", change: "+89%", up: true },
    { label: "IA para Jurídico", change: "+203%", up: true },
    { label: "Automação de Marketing", change: "+36%", up: true },
    { label: "Gestão de Freelancers", change: "+22%", up: true },
  ];
}
