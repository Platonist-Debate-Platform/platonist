import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { User } from './User';

export interface Authentication extends User {
  status: string;
}

export type AuthenticationState = ReactReduxRequestState<
  Authentication,
  AxiosRequestConfig
>;
