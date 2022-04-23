/* eslint-disable default-param-last */

import { availableLanguages, intlEn } from '../Intl';
import { AvailableLanguagesExtended, LocalizeActionKeys } from './Keys';
import { AvailableLanguage, LocalizeActions } from './Types';
import { assignLanguage, getIntlObject } from './Utils';

const win = globalThis || window;

const intlObject = getIntlObject(
  assignLanguage(win.navigator?.language as AvailableLanguagesExtended),
);
const initialState = intlObject || availableLanguages[0];

export const localizeReducer = (
  state: AvailableLanguage = initialState,
  action: LocalizeActions,
) => {
  switch (action.type) {
    case LocalizeActionKeys.Select:
      return getIntlObject(action.payload) || initialState;
    case LocalizeActionKeys.Reset:
      return intlEn;
    default:
      return state;
  }
};
