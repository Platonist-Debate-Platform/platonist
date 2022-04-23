import { StandardActionFn } from '../../Redux';
import { AvailableLanguagesExtended, LocalizeActionKeys } from './Keys';

export const resetLanguage: StandardActionFn<
  LocalizeActionKeys.Reset,
  undefined,
  undefined
> = () => ({
  type: LocalizeActionKeys.Reset,
  payload: undefined,
});

export const selectLanguage: StandardActionFn<
  LocalizeActionKeys.Select,
  AvailableLanguagesExtended,
  undefined
> = (payload: AvailableLanguagesExtended) => ({
  type: LocalizeActionKeys.Select,
  payload,
});

export const createLocalizeAction = () => ({
  resetLanguage,
  selectLanguage,
});

export const localizeAction = createLocalizeAction();
