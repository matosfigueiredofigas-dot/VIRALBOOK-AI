"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "BR", name: "Brazil" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
];

export function CountrySelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCountry = searchParams.get("country") || "US";

  const handleCountryChange = (code: string | null) => {
    const val = code || "US";
    const params = new URLSearchParams(searchParams.toString());
    params.set("country", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[180px] h-9 bg-background/50 backdrop-blur-md border-border/40 focus:ring-primary/20">
          <SelectValue placeholder="Select Country" />
        </SelectTrigger>
        <SelectContent className="bg-background/80 backdrop-blur-xl border-border/40">
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
