/* eslint-disable no-shadow */

export enum RequestActionType {
  Cancel = 'CANCEL',
  Clear = 'CLEAR',
  Fail = 'FAIL',
  Load = 'LOAD',
  Receive = 'RECEIVE',
  Update = 'UPDATE',
}

export enum RequestStatus {
  Error = 'ERROR',
  Initial = 'INITIAL',
  Loaded = 'LOADED',
  Updating = 'UPDATING',
}

export enum RequestMethod {
  Create = 'POST',
  Delete = 'DELETE',
  Receive = 'GET',
  Update = 'PUT',
}
