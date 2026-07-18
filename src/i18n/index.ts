import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const STORAGE_KEY = 'eyeguard-lang';

export function getStoredLang(): LangCode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'uz' || v === 'ru' || v === 'en') return v;
  } catch {
    /* ignore */
  }
  return 'uz';
}

export function setLang(code: LangCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* ignore */
  }
  void i18n.changeLanguage(code);
}

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: getStoredLang(),
  fallbackLng: 'uz',
  interpolation: { escapeValue: false },
});

export default i18n;
