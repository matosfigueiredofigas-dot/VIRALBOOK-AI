'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Language, Translations, DetectedRegionInfo } from '../types/i18n';
import { pt } from '../locales/pt';
import { en } from '../locales/en';
import { es } from '../locales/es';
import { detectRegionAndLanguage } from '../utils/region-detector';

const dictionaries: Record<Language, Translations> = { pt, en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language, isManual?: boolean) => void;
  t: Translations;
  isAutoDetect: boolean;
  setIsAutoDetect: (auto: boolean) => void;
  detectedRegionInfo: DetectedRegionInfo | null;
  triggerAutoDetectRegion: () => Promise<Language>;
  isDetectingRegion: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: pt,
  isAutoDetect: false,
  setIsAutoDetect: () => {},
  detectedRegionInfo: null,
  triggerAutoDetectRegion: async () => 'pt',
  isDetectingRegion: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');
  const [isAutoDetect, setIsAutoDetectState] = useState<boolean>(false);
  const [detectedRegionInfo, setDetectedRegionInfo] = useState<DetectedRegionInfo | null>(null);
  const [isDetectingRegion, setIsDetectingRegion] = useState<boolean>(false);

  // Immediate DOM updates (<html lang="...">)
  const applyLanguageToDOM = useCallback((lang: Language) => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
      localStorage.setItem('viralbook_lang', lang);
      document.cookie = `viralbook_lang=${lang}; path=/; max-age=31536000`;
    }
  }, []);

  const setLanguage = useCallback((lang: Language, isManual = true) => {
    setLanguageState(lang);
    applyLanguageToDOM(lang);
    if (isManual) {
      setIsAutoDetectState(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('viralbook_auto_detect_lang', 'false');
      }
    }
  }, [applyLanguageToDOM]);

  const setIsAutoDetect = useCallback((auto: boolean) => {
    setIsAutoDetectState(auto);
    if (typeof window !== 'undefined') {
      localStorage.setItem('viralbook_auto_detect_lang', auto ? 'true' : 'false');
    }
  }, []);

  const triggerAutoDetectRegion = useCallback(async (): Promise<Language> => {
    setIsDetectingRegion(true);
    try {
      const info = await detectRegionAndLanguage();
      setDetectedRegionInfo(info);
      setLanguageState(info.language);
      applyLanguageToDOM(info.language);
      setIsAutoDetectState(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('viralbook_auto_detect_lang', 'true');
      }
      return info.language;
    } catch {
      return language;
    } finally {
      setIsDetectingRegion(false);
    }
  }, [applyLanguageToDOM, language]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedAutoDetect = localStorage.getItem('viralbook_auto_detect_lang');
    const savedLang = localStorage.getItem('viralbook_lang') as Language;

    queueMicrotask(() => {
      if (savedAutoDetect === 'true' || (!savedLang && savedAutoDetect !== 'false')) {
        triggerAutoDetectRegion();
      } else if (savedLang && (savedLang === 'pt' || savedLang === 'en' || savedLang === 'es')) {
        setLanguageState(savedLang);
        applyLanguageToDOM(savedLang);
      } else {
        triggerAutoDetectRegion();
      }
    });
  }, [applyLanguageToDOM, triggerAutoDetectRegion]);

  const t = dictionaries[language] || pt;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isAutoDetect,
        setIsAutoDetect,
        detectedRegionInfo,
        triggerAutoDetectRegion,
        isDetectingRegion,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
