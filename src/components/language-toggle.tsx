'use client';

import React from 'react';
import { useLanguage } from '../contexts/language-context';
import { Language } from '../types/i18n';
import { Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <Globe className="w-4 h-4 text-muted-foreground mr-1.5 shrink-0" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent border border-border text-foreground text-xs font-medium rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        aria-label="Select Language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-background text-foreground">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
