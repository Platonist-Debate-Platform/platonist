/* eslint-disable default-param-last */

import { BlogLinkActionKeys } from './Keys';
import { BlogLinkState, BlogLinkActions } from './Types';

const initialState: BlogLinkState = {
  id: undefined,
};

export const blogLinkReducer = (
  state: BlogLinkState = initialState,
  action: BlogLinkActions,
) => {
  switch (action.type) {
    case BlogLinkActionKeys.Clear:
      return initialState;
    case BlogLinkActionKeys.Set:
      return {
        ...state,
        id: action.payload.id || state.id,
        blog: action.payload || state.blog,
      };
    default:
      return state;
  }
};
