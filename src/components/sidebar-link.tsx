"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  variant?: "default" | "welcome" | "favorite" | "admin";
  dataTour?: string;
}

export function SidebarLink({ href, icon: Icon, title, variant = "default", dataTour }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Premium active styling based on variant (using ! to override UI library defaults)
  let activeClass = "";
  let hoverClass = "";

  if (variant === "welcome") {
    activeClass = "!bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white !font-bold shadow-lg shadow-emerald-500/25";
    hoverClass = "hover:bg-emerald-500/10 hover:text-emerald-500";
  } else if (variant === "favorite") {
    activeClass = "!bg-gradient-to-r !from-rose-500 !to-red-600 !text-white !font-bold shadow-lg shadow-rose-500/25";
    hoverClass = "hover:bg-red-500/10 hover:text-red-500";
  } else if (variant === "admin") {
    activeClass = "!bg-gradient-to-r !from-amber-500 !to-orange-600 !text-white !font-bold shadow-lg shadow-amber-500/25";
    hoverClass = "hover:bg-amber-500/10 hover:text-amber-500";
  } else {
    // Solid vibrant gradient for default main active items
    activeClass = "!bg-gradient-to-r !from-primary !to-blue-600 !text-white !font-bold shadow-lg shadow-primary/25";
    hoverClass = "hover:bg-primary/10 hover:text-primary";
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link href={href} className="flex items-center gap-3 px-3 w-full h-full" />}
        className={cn(
          "h-11 transition-all duration-300 rounded-lg group",
          isActive ? activeClass : hoverClass
        )}
        data-tour={dataTour}
      >
        <Icon className={cn("h-5 w-5 transition-colors duration-300", isActive ? "!text-white" : "text-muted-foreground group-hover:text-primary")} />
        <span className="font-medium text-sm">{title}</span>
        {isActive && variant === "default" && (
          <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
