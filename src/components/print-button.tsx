"use client"

import { Printer } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function PrintButton() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md font-bold hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <Printer className="h-4 w-4" /> {isEn ? "Print / PDF" : isEs ? "Imprimir / PDF" : "Imprimir / PDF"}
    </button>
  )
}
