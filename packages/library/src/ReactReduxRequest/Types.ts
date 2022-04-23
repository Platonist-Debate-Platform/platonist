import {
  cancelRequest,
  failRequest,
  loadRequest,
  receiveRequest,
  updateRequest,
} from './CreateAction';
import { RequestStatus } from './Keys';

export interface RequestIDs {
  public: string[];
  secure: string[];
}

export interface ReactReduxRequestProps {
  identifiers: RequestIDs;
  settings: Object;
}

export type ValuesOf<T extends any[]> = T[number];

export type KeysOfRequestIDs = ValuesOf<
  RequestIDs['public'] | RequestIDs['secure']
>;

export type ReactReduxRequestActions =
  | ReturnType<typeof cancelRequest>
  | ReturnType<typeof failRequest>
  | ReturnType<typeof loadRequest>
  | ReturnType<typeof receiveRequest>
  | ReturnType<typeof updateRequest>;

export interface ReactReduxRequestDispatch {
  <A extends ReactReduxRequestActions>(action: A): A;
}

export interface ReactReduxRequestErrorDetail {
  code: string;
  info: { type: string };
  message: string;
  path: string;
}

export interface ReactReduxRequestErrorMessage {
  id: string;
  message: string;
}

export type StrapiErrorMessage = { messages: ReactReduxRequestErrorMessage[] };

export interface ReactReduxRequestError {
  code: string;
  details: ReactReduxRequestErrorDetail[];
  message: string | StrapiErrorMessage[];
  name: string;
  statusCode: number;
}

export interface ReactReduxRequestState<
  Payload extends Object,
  Meta extends Object,
> {
  error?: ReactReduxRequestError;
  hash: string;
  id: KeysOfRequestIDs;
  meta?: Meta & { config?: Meta };
  result?: Payload;
  status: RequestStatus;
}

export interface RequestWithPagerProps {
  _limit: number;
  _start: number;
}

export interface RequestWithPager<Model> {
  count: number;
  countValue: number;
  current?: RequestWithPagerProps;
  next: RequestWithPagerProps | null;
  prev: RequestWithPagerProps | null;
  value: Model;
}

export interface QueryParameterBase {
  // Maximum number of results possible
  _limit?: number;

  // Sort according to a specific field.
  _sort?: string;

  // Skip a specific number of entries (especially useful for pagination)
  _start?: number;

  // Get entries that matches exactly your input
  '='?: string;

  // Get records that are not equals to something
  _ne?: string;

  // Get record that are lower than a value
  _lt?: string;

  // Get records that are lower than or equal to a value
  _lte?: string;

  // Get records that are greater than a value
  _gt?: string;

  // Get records that are greater than or equal a value
  _gte?: string;

  // Get records that contains a value
  _contains?: string;

  // Get records that contains (case sensitive) a value
  _containss?: string;

  // Get records that matches any value in the array of values
  _in?: string[];

  // Get records that doesn't match any value in the array of values
  _nin?: string[];

  [key: string]: any;
}

export type QueryParameter = Partial<QueryParameterBase>;
