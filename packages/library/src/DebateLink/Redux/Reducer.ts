/* eslint-disable default-param-last */

import { DebateLinkActionKeys } from './Keys';
import { DebateLinkActions, DebateLinkState } from './Types';

const initialState: DebateLinkState = {
  id: undefined,
};

export const debateLinkReducer = (
  state: DebateLinkState = initialState,
  action: DebateLinkActions,
) => {
  switch (action.type) {
    case DebateLinkActionKeys.Clear:
      return initialState;
    case DebateLinkActionKeys.Set:
      return {
        ...state,
        id: action.payload.id || state.id,
        debate: action.payload || state.debate,
      };
    default:
      return state;
  }
};
