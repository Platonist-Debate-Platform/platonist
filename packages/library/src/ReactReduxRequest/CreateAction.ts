import { AxiosRequestConfig } from 'axios';

import { RequestActionType } from './Keys';
import { KeysOfRequestIDs, ReactReduxRequestError } from './Types';
import { createRequestActionType } from './Utils';

export type RequestAction<
  Payload extends Object,
  Meta extends Object | undefined,
> = {
  type: ReturnType<typeof createRequestActionType>;
  payload?: Payload;
  meta?: Meta;
};

const defaultAction = <Meta extends Object | undefined = undefined>(
  type: RequestActionType,
  id: KeysOfRequestIDs,
  meta: Meta,
) => ({
  type: createRequestActionType(type, id),
  meta,
});

export const cancelRequest = <
  Payload extends Object = {},
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  meta?: Meta,
): RequestAction<Payload, Meta> =>
  defaultAction<Meta | undefined>(RequestActionType.Cancel, id, meta);

export const clearRequest = <
  Payload extends Object = {},
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  meta?: Meta,
): RequestAction<Payload, Meta> =>
  defaultAction<Meta | undefined>(RequestActionType.Clear, id, meta);

export const failRequest = <
  Payload extends ReactReduxRequestError,
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  payload: Payload,
  meta?: Meta,
): RequestAction<Payload, Meta> => ({
  ...defaultAction<Meta | undefined>(RequestActionType.Fail, id, meta),
  payload,
});

export const loadRequest = <
  Payload extends Object = {},
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  meta?: Meta & AxiosRequestConfig,
): RequestAction<Payload, Meta> =>
  defaultAction<Meta | undefined>(RequestActionType.Load, id, meta);

export const receiveRequest = <
  Payload extends Object = {},
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  payload: Payload,
  meta?: Meta,
): RequestAction<Payload, Meta> => ({
  ...defaultAction<Meta | undefined>(RequestActionType.Receive, id, meta),
  payload,
});

export const updateRequest = <
  Payload extends Object = {},
  Meta extends Object | undefined = undefined,
>(
  id: KeysOfRequestIDs,
  meta?: Meta & AxiosRequestConfig,
): RequestAction<Payload, Meta> => {
  const payload = defaultAction<Meta | undefined>(
    RequestActionType.Load,
    id,
    meta,
  );
  return {
    ...payload,
    meta: Object.assign(payload.meta || {}, {
      update: true,
    }) as Meta & { update: boolean },
  };
};

export const requestAction = {
  cancel: cancelRequest,
  clear: clearRequest,
  fail: failRequest,
  load: loadRequest,
  receive: receiveRequest,
  update: updateRequest,
};
