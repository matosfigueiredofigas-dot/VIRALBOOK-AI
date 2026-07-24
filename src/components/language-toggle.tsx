'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Language } from '@/types/i18n';
import { Globe, ChevronDown, Check, Compass, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    language,
    setLanguage,
    t,
    isAutoDetect,
    triggerAutoDetectRegion,
    isDetectingRegion,
    detectedRegionInfo
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-9 w-24 rounded-full border border-border/50 bg-background/50 animate-pulse ${className}`} />
    );
  }

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-border/50 bg-background/60 hover:bg-muted text-sm font-semibold transition-all shadow-sm select-none cursor-pointer text-foreground backdrop-blur-md"
        aria-label={t.common.selectLanguage}
      >
        <span className="flex h-4 w-4 items-center justify-center text-xs">
          {currentLang.flag}
        </span>
        <span className="text-xs font-bold tracking-wide">{currentLang.code.toUpperCase()}</span>
        {isAutoDetect && (
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title={t.common.autoDetectRegion} />
        )}
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-52 rounded-2xl border border-border/50 bg-popover/95 p-2 shadow-2xl z-[100] backdrop-blur-2xl"
          >
            <div className="text-[10px] font-bold text-muted-foreground/70 px-3 py-1.5 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-primary" /> {t.common.language}
              </span>
              {isAutoDetect && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 text-[9px] font-extrabold border border-emerald-500/20">
                  AUTO REGION
                </span>
              )}
            </div>

            {/* Manual Language Options */}
            <div className="space-y-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code && !isAutoDetect;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code, true);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-border/40 my-1.5" />

            {/* Auto Detect Region Button */}
            <button
              disabled={isDetectingRegion}
              onClick={async () => {
                await triggerAutoDetectRegion();
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                isAutoDetect
                  ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-500 border border-emerald-500/30"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDetectingRegion ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                ) : (
                  <Compass className={`h-3.5 w-3.5 ${isAutoDetect ? "text-emerald-500" : "text-muted-foreground"}`} />
                )}
                <div className="flex flex-col">
                  <span>{t.common.autoDetectRegion}</span>
                  {detectedRegionInfo?.regionName && isAutoDetect && (
                    <span className="text-[9px] text-emerald-500/80 font-normal">
                      📍 {detectedRegionInfo.regionName}
                    </span>
                  )}
                </div>
              </div>
              {isAutoDetect && <Sparkles className="h-3.5 w-3.5 text-emerald-500" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
