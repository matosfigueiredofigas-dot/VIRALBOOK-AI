'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Translations } from '../types/i18n';
import { pt } from '../locales/pt';
import { en } from '../locales/en';
import { es } from '../locales/es';

const dictionaries: Record<Language, Translations> = { pt, en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  t: pt,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt');

  useEffect(() => {
    // Carregar idioma guardado em localStorage ou Cookie
    const savedLang = localStorage.getItem('viralbook_lang') as Language;
    if (savedLang && (savedLang === 'pt' || savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    } else {
      // Detetar idioma do browser como alternativa
      const browserLang = navigator.language.slice(0, 2).toLowerCase();
      if (browserLang === 'es') setLanguageState('es');
      else if (browserLang === 'en') setLanguageState('en');
      else setLanguageState('pt');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('viralbook_lang', lang);
    document.cookie = `viralbook_lang=${lang}; path=/; max-age=31536000`;
  };

  const t = dictionaries[language] || pt;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
