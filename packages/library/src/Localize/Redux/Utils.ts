import { availableLanguages } from '../Intl';
import { AvailableLanguages, AvailableLanguagesExtended } from './Keys';

const resolveLanguage = (
  language: AvailableLanguagesExtended,
): AvailableLanguages | undefined => {
  if (language && language.indexOf('-') > -1) {
    const langArray = language.split('-');
    return langArray && langArray.length > 0
      ? (langArray[0] as AvailableLanguages)
      : undefined;
  }
  return undefined;
};

const isLanguageAvailable = (code: AvailableLanguagesExtended): boolean =>
  availableLanguages.some((language) => language.extendedCode === code);

const transformLanguageCode = (
  code: AvailableLanguages,
): AvailableLanguagesExtended => {
  let extended: AvailableLanguagesExtended = AvailableLanguagesExtended.En150;
  availableLanguages.forEach((lang) => {
    if (lang.code === code) {
      extended = lang.extendedCode;
    }
  });
  return extended;
};

export const assignLanguage = (
  language: AvailableLanguagesExtended,
): AvailableLanguagesExtended => {
  const resolvedLanguage = resolveLanguage(language) || AvailableLanguages.En;
  const selected = transformLanguageCode(resolvedLanguage);
  return (
    (isLanguageAvailable(selected) && selected) ||
    AvailableLanguagesExtended.En150
  );
};

export const getIntlObject = (extendedCode: AvailableLanguagesExtended) => {
  const index = availableLanguages.findIndex(
    (lang) => lang.enabled && lang.extendedCode === extendedCode,
  );
  return index > -1 && availableLanguages[index];
};
