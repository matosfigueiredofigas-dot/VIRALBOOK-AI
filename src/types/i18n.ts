export type Language = 'pt' | 'en' | 'es';

export interface Translations {
  common: {
    dashboard: string;
    library: string;
    radar: string;
    hunter: string;
    settings: string;
    advisors: string;
    favorites: string;
    login: string;
    logout: string;
    search: string;
    generate: string;
    save: string;
    cancel: string;
    language: string;
    selectLanguage: string;
  };
  navigation: {
    dashboard: string;
    library: string;
    radar: string;
    hunter: string;
    funnel: string;
    teardown: string;
    advisors: string;
    settings: string;
  };
  groq: {
    generating: string;
    analyzing: string;
    success: string;
    error: string;
  };
}
