import bn from './bn.json';
import en from './en.json';
import { SYLHETI_PASSENGER_LINES, SylhetiDialogueSet } from './sylheti';

export type I18nKey = keyof typeof bn;

export const translations = {
  bn,
  en,
};

export const getTranslation = (key: I18nKey, lang: 'bn' | 'en' = 'bn'): string => {
  const dict = translations[lang] || translations.bn;
  return (dict as Record<string, string>)[key] || (translations.bn as Record<string, string>)[key] || key;
};

export { SYLHETI_PASSENGER_LINES };
export type { SylhetiDialogueSet };
