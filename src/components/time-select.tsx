"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

export function TimeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentTime = searchParams.get("time") || "7d";

  const handleTimeChange = (time: string | null) => {
    const val = time || "7d";
    const params = new URLSearchParams(searchParams);
    params.set("time", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <Select value={currentTime} onValueChange={handleTimeChange}>
        <SelectTrigger className="w-[140px] bg-background/50 border-white/10 text-sm">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="now">Agora (1h)</SelectItem>
          <SelectItem value="1d">Último dia</SelectItem>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="60d">Últimos 60 dias</SelectItem>
          <SelectItem value="90d">Últimos 90 dias</SelectItem>
          <SelectItem value="all">Sempre</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
