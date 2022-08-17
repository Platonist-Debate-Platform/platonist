/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */

import { isArray, merge, unionBy } from 'lodash';
import { RequestActionType, RequestStatus } from './Keys';
import {
  KeysOfRequestIDs,
  ReactReduxRequestActions,
  ReactReduxRequestState,
  ReactReduxRequestError,
} from './Types';
import { createRequestActionType } from './Utils';
import { randomHash } from '../Utils';

const createInitialState = <
  Payload extends Object = {},
  Meta extends Object = {},
>(
  id: KeysOfRequestIDs,
): ReactReduxRequestState<Payload, Meta> => ({
  error: undefined,
  hash: randomHash(32),
  id,
  result: undefined,
  status: RequestStatus.Initial,
});

export const createReducer = <
  Payload extends Object = {},
  Meta extends Object = {},
>(
  id: KeysOfRequestIDs,
) => {
  const initialState = {
    ...createInitialState<Payload, Meta>(id),
    hash: randomHash(32),
  };

  const reducer = (
    state: ReactReduxRequestState<Payload, Meta> = initialState,
    action: ReactReduxRequestActions,
  ): ReactReduxRequestState<Payload, Meta> => {
    const update = !!(
      action.meta && (action.meta as Meta & { update: boolean }).update
    );

    switch (action.type) {
      case createRequestActionType(RequestActionType.Cancel, id):
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          status: RequestStatus.Loaded,
        };

      case createRequestActionType(RequestActionType.Clear, id):
        return {
          ...initialState,
          hash: randomHash(32),
        };

      case createRequestActionType(RequestActionType.Fail, id):
        return {
          ...state,
          hash: randomHash(32),
          error: action.payload as ReactReduxRequestError,
          meta: action.meta as Meta,
          status: RequestStatus.Error,
        };

      case createRequestActionType(RequestActionType.Load, id):
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          status: RequestStatus.Updating,
          result: update ? state.result : undefined,
        };

      case createRequestActionType(RequestActionType.Receive, id):
        // eslint-disable-next-line no-console
        console.log(action);

        const stateValue =
          state.result &&
          (state.result as Payload & { value: object | Array<unknown> })?.value;
        const payloadValue =
          action.payload &&
          (state.result as Payload & { value: object | Array<unknown> })?.value;
        const hasValue = !!stateValue;

        let result: Object = action.payload || {};

        if (hasValue) {
          (result as Payload & { value: object | Array<unknown> }).value =
            isArray(stateValue) && isArray(payloadValue)
              ? unionBy(stateValue || [], payloadValue, 'id')
              : merge(payloadValue || {}, stateValue || {});
        } else {
          result =
            (!state.result && isArray(result)) || isArray(state.result)
              ? unionBy<Payload>(
                  (action.payload as []) || [],
                  state.result || [],
                  'id',
                )
              : merge(state.result || {}, action.payload || {});
        }

        if (action.meta && (action.meta as any).update) {
          delete (action.meta as any).update;
        }

        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          result: result as Payload,
          status: RequestStatus.Loaded,
        };

      case createRequestActionType(RequestActionType.Update, id):
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          result: state.result as Payload,
          status: RequestStatus.Updating,
        };

      default:
        return state;
    }
  };

  return reducer;
};
