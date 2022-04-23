import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState } from '../ReactReduxRequest';

export type FileState = ReactReduxRequestState<Blob, AxiosRequestConfig>;
