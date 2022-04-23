import { StandardActionFn } from '../../Redux';
import { AlertActionTypes, ToggleType } from './Keys';
import { AlertAddPayload, AlertPayload } from './Types';

export const addAlert: StandardActionFn<
  AlertActionTypes.Add,
  AlertAddPayload,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Add,
  payload,
});

export const clearAlert: StandardActionFn<
  AlertActionTypes.Clear,
  undefined,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Clear,
  payload,
});

export const hideAlert: StandardActionFn<
  AlertActionTypes.Hide,
  AlertPayload,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Hide,
  payload: {
    ...payload,
    state: ToggleType.Hide,
  },
});

export const removeAlert: StandardActionFn<
  AlertActionTypes.Remove,
  AlertPayload,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Remove,
  payload,
});

export const showAlert: StandardActionFn<
  AlertActionTypes.Show,
  AlertPayload,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Show,
  payload: {
    ...payload,
    state: ToggleType.Show,
  },
});

export const toggleAlert: StandardActionFn<
  AlertActionTypes.Toggle,
  AlertPayload,
  undefined
> = (payload) => ({
  type: AlertActionTypes.Toggle,
  payload,
});

export const createAlertAction = () => ({
  add: addAlert,
  clear: clearAlert,
  hide: hideAlert,
  remove: removeAlert,
  show: showAlert,
  toggle: toggleAlert,
});

export const alertAction = createAlertAction();
