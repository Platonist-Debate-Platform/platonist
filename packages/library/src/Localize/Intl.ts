import { createIntl, createIntlCache } from 'react-intl';

import {
  AvailableLanguage,
  AvailableLanguages,
  AvailableLanguagesExtended,
} from './Redux';
// import translations from '../../Assets/I18n/messages';
const intlCache = createIntlCache();

const intlConfigDe = {
  locale: AvailableLanguagesExtended.DeDE,
  defaultLocale: AvailableLanguagesExtended.En150,
  // messages: translations.de,
};

const intlConfigEn = {
  locale: AvailableLanguagesExtended.En150,
  // messages: translations.en,
};

export const intlDe = createIntl(intlConfigDe, intlCache);

export const intlEn = createIntl(intlConfigEn, intlCache);

export const availableLanguages: AvailableLanguage[] = [
  {
    name: 'English',
    enabled: true,
    extendedCode: AvailableLanguagesExtended.En150,
    code: AvailableLanguages.En,
    intl: intlEn,
    intlConfig: intlConfigEn,
  },
  {
    name: 'Deutsch',
    enabled: true,
    extendedCode: AvailableLanguagesExtended.DeDE,
    code: AvailableLanguages.De,
    intl: intlDe,
    intlConfig: intlConfigDe,
  },
];
