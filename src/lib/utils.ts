import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFilterDate(timeParam: string): string | null {
  const now = new Date()
  switch (timeParam) {
    case 'now': // Última 1 hora
      now.setHours(now.getHours() - 1)
      return now.toISOString()
    case '1d':
      now.setDate(now.getDate() - 1)
      return now.toISOString()
    case '7d':
      now.setDate(now.getDate() - 7)
      return now.toISOString()
    case '30d':
      now.setDate(now.getDate() - 30)
      return now.toISOString()
    case '60d':
      now.setDate(now.getDate() - 60)
      return now.toISOString()
    case '90d':
      now.setDate(now.getDate() - 90)
      return now.toISOString()
    case 'all':
    default:
      return null
  }
}
