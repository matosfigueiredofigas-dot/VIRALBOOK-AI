import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("showcase_projects")
    .select("title, upvotes_count")
    .eq("id", id)
    .single();

  const upvotes = project?.upvotes_count || 0;
  const title = project?.title || "ViralBook AI";

  // Retorna um SVG de alta qualidade com efeito glassmorphism / gradiente
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="54" viewBox="0 0 240 54" fill="none">
    <rect width="240" height="54" rx="12" fill="#09090B" stroke="#27272A" stroke-width="1.5"/>
    <rect x="1" y="1" width="238" height="52" rx="11" fill="url(#paint0_linear)" fill-opacity="0.15"/>
    
    <!-- Ícone de Fogo/Voto -->
    <path d="M22 17C22 17 24.5 13.5 28 13.5C31.5 13.5 34 17 34 21C34 26 29 29.5 29 33.5C29 36 30.5 37.5 32 37.5C27 41.5 20 38.5 20 31.5C20 26.5 23 23 23 23C23 23 22 20.5 22 17Z" fill="#F97316"/>
    <path d="M27 28C27 28 28.5 26 30.5 26C32.5 26 33.5 28 33.5 30.5C33.5 33.5 30.5 35.5 30.5 37.5C30.5 38.5 31 39 31.5 39.5C29 41.5 25.5 39.5 25.5 36.5C25.5 33.5 27 31 27 31Z" fill="#FBBF24"/>

    <!-- Texto -->
    <text x="44" y="24" fill="#A1A1AA" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="600" letter-spacing="0.5">FEATURED ON VIRALBOOK AI</text>
    <text x="44" y="39" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700">${escapeXml(title.slice(0, 18))}</text>
    
    <!-- Contador de Votos (Pill) -->
    <rect x="178" y="14" width="48" height="26" rx="8" fill="#18181B" stroke="#3F3F46"/>
    <text x="202" y="31" fill="#F97316" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" text-anchor="middle">▲ ${upvotes}</text>

    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="240" y2="54" gradientUnits="userSpaceOnUse">
        <stop stop-color="#F97316"/>
        <stop offset="1" stop-color="#A855F7"/>
      </linearGradient>
    </defs>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
