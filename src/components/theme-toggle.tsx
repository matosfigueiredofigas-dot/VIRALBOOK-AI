"use client"

import * as React from "react"
import { Moon, Sun, Cpu, Sparkles, Coffee, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

const themes = [
  { id: "light", name: "Claro", icon: Sun, color: "bg-amber-400" },
  { id: "dark", name: "Escuro", icon: Moon, color: "bg-slate-950" },
  { id: "tech-ai", name: "Tech & AI", icon: Cpu, color: "bg-cyan-500" },
  { id: "cyberpunk", name: "Cyberpunk", icon: Sparkles, color: "bg-fuchsia-500" },
  { id: "retro", name: "Retro Sepia", icon: Coffee, color: "bg-amber-700" },
]

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Avoid hydration mismatch by rendering a placeholder until mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-28 rounded-full border border-border/50 bg-background/50 animate-pulse" />
    )
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[1] // fallback to dark
  const CurrentIcon = currentTheme.icon

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3 rounded-full border border-border/50 bg-background/50 hover:bg-muted text-sm font-semibold transition-all shadow-sm select-none cursor-pointer text-foreground"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CurrentIcon className="h-3.5 w-3.5" />
        </span>
        <span className="hidden md:inline text-xs">{currentTheme.name}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-48 rounded-2xl border border-border/50 bg-card p-2 shadow-xl z-[100] backdrop-blur-xl"
          >
            <div className="text-[10px] font-bold text-muted-foreground/70 px-3 py-1.5 uppercase tracking-wider">
              Escolha o Tema
            </div>
            <div className="space-y-1">
              {themes.map((t) => {
                const Icon = t.icon
                const isSelected = theme === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2.5 w-2.5 rounded-full ${t.color} border border-border/30`} />
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 opacity-80" />
                        {t.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
