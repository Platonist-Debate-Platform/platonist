import { RequestActionType } from './Keys';
import {
  KeysOfRequestIDs,
  ReactReduxRequestErrorMessage,
  StrapiErrorMessage,
} from './Types';

export const createRequestActionType = (
  type: RequestActionType,
  id: KeysOfRequestIDs,
): string => `@ReactReduxRequest/${type}_${id.toUpperCase()}`;

export const getStrapiErrorMessages = (
  message: StrapiErrorMessage[],
): ReactReduxRequestErrorMessage[] | undefined => {
  const messages: ReactReduxRequestErrorMessage[] = [];
  message.forEach((msg) => msg.messages.forEach((msgs) => messages.push(msgs)));
  return messages;
};
