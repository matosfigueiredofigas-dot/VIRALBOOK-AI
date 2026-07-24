import { Language, DetectedRegionInfo } from '@/types/i18n';

const PT_TIMEZONES = [
  'America/Sao_Paulo', 'America/Fortaleza', 'America/Manaus', 'America/Belem',
  'America/Recife', 'America/Cuiaba', 'America/Campo_Grande', 'America/Noronha',
  'Europe/Lisbon', 'Atlantic/Azores', 'Atlantic/Madeira', 'Africa/Luanda',
  'Africa/Maputo', 'Africa/Bissau', 'Africa/Sao_Tome', 'Asia/Macau', 'Asia/East_Timor'
];

const ES_TIMEZONES = [
  'Europe/Madrid', 'Atlantic/Canary', 'America/Mexico_City', 'America/Bogota',
  'America/Buenos_Aires', 'America/Santiago', 'America/Lima', 'America/Caracas',
  'America/Guayaquil', 'America/Guatemala', 'America/La_Paz', 'America/Santo_Domingo',
  'America/Tegucigalpa', 'America/Managua', 'America/Asuncion', 'America/Montevideo',
  'America/San_Jose', 'America/Panama', 'America/Havana', 'America/Puerto_Rico'
];

const PT_COUNTRIES = ['BR', 'PT', 'AO', 'MZ', 'GW', 'ST', 'CV', 'TL', 'MO'];
const ES_COUNTRIES = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PR', 'UY', 'GQ'];

export async function detectRegionAndLanguage(): Promise<DetectedRegionInfo> {
  if (typeof window === 'undefined') {
    return { language: 'pt' };
  }

  // 1. Check Browser Timezone (Instant & Zero Latency)
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      if (PT_TIMEZONES.some(tz => timeZone.toLowerCase().includes(tz.toLowerCase()))) {
        return { regionName: timeZone, language: 'pt' };
      }
      if (ES_TIMEZONES.some(tz => timeZone.toLowerCase().includes(tz.toLowerCase()))) {
        return { regionName: timeZone, language: 'es' };
      }
    }
  } catch {
    // Ignore timezone error
  }

  // 2. Check Navigator Languages
  try {
    const userLangs = navigator.languages || [navigator.language];
    for (const lang of userLangs) {
      const code = lang.slice(0, 2).toLowerCase();
      if (code === 'pt') return { regionName: lang, language: 'pt' };
      if (code === 'es') return { regionName: lang, language: 'es' };
      if (code === 'en') return { regionName: lang, language: 'en' };
    }
  } catch {
    // Ignore navigator error
  }

  // 3. Fallback: IP Geolocation API with fast timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const countryCode = data?.country_code?.toUpperCase();
      const region = data?.country_name || countryCode;

      if (countryCode && PT_COUNTRIES.includes(countryCode)) {
        return { countryCode, regionName: region, language: 'pt' };
      }
      if (countryCode && ES_COUNTRIES.includes(countryCode)) {
        return { countryCode, regionName: region, language: 'es' };
      }
      if (countryCode) {
        return { countryCode, regionName: region, language: 'en' };
      }
    }
  } catch {
    // Fallback if network request fails or aborts
  }

  return { language: 'pt' };
}
