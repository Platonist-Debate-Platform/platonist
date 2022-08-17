/* eslint-disable default-param-last */

import { AlertActionTypes, ToggleType } from './Keys';
import {
  AlertActions,
  AlertAddPayload,
  AlertPayload,
  AlertState,
} from './Types';

const initialState: AlertState = {
  danger: [],
  info: [],
  success: [],
  warning: [],
};

const warnings = (id: string) => ({
  skip: `Skip adding alert with Id: "${id}".`,
  notFound: `Alert with Id: "${id}" doesn't exist.`,
});

const addAlertToState = (
  state: AlertState,
  payload: AlertPayload | AlertAddPayload,
): AlertState => {
  const alert = state[payload.type].find((a) => a.id === payload.id);
  if (alert) {
    // eslint-disable-next-line no-console
    console.warn(warnings(payload.id).skip);
    return state;
  }
  state[payload.type].push(payload);
  return state;
};

const hideAlert = (
  state: AlertState,
  payload: AlertPayload | AlertAddPayload,
): AlertState => {
  const newState = state;
  const index = newState[payload.type].findIndex((a) => a.id === payload.id);

  if (!(index > -1)) {
    // eslint-disable-next-line no-console
    console.warn(warnings(payload.id).notFound);
    return newState;
  }

  newState[payload.type][index].state = ToggleType.Hide;

  return newState;
};

const removeAlert = (
  state: AlertState,
  payload: AlertPayload | AlertAddPayload,
): AlertState => {
  const index = state[payload.type].findIndex((a) => a.id === payload.id);

  if (!(index > -1)) {
    // eslint-disable-next-line no-console
    console.warn(warnings(payload.id).notFound);
    return state;
  }

  state[payload.type].splice(index, 1);

  return state;
};

const showAlert = (
  state: AlertState,
  payload: AlertPayload | AlertAddPayload,
): AlertState => {
  const newState = state;
  const index = newState[payload.type].findIndex((a) => a.id === payload.id);
  if (!(index > -1)) {
    // eslint-disable-next-line no-console
    console.warn(warnings(payload.id).notFound);
    return state;
  }

  newState[payload.type][index].state = ToggleType.Show;

  return newState;
};

const toggle = (
  state: AlertState,
  payload: AlertPayload | AlertAddPayload,
): AlertState => {
  if (payload.state === ToggleType.Hide) {
    return hideAlert(state, payload);
  }

  if (payload.state === ToggleType.Show) {
    return showAlert(state, payload);
  }

  return state;
};

export const alertReducer = (
  state: AlertState = initialState,
  action: AlertActions,
): AlertState => {
  switch (action.type) {
    case AlertActionTypes.Add:
      return {
        ...state,
        ...addAlertToState(state, action.payload),
      };

    case AlertActionTypes.Clear:
      return initialState;

    case AlertActionTypes.Hide:
      return {
        ...state,
        ...hideAlert(state, action.payload),
      };

    case AlertActionTypes.Remove:
      return {
        ...state,
        ...removeAlert(state, action.payload),
      };

    case AlertActionTypes.Show:
      return {
        ...state,
        ...showAlert(state, action.payload),
      };

    case AlertActionTypes.Toggle:
      return {
        ...state,
        ...toggle(state, action.payload),
      };

    default:
      return state;
  }
};
