import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Role } from './Role';

export interface Permission {
  action: string;
  controller: string;
  enabled: boolean;
  id: string;
  policy: string;
  role?: Role | null;
  type: string;
}

export type PermissionState = ReactReduxRequestState<
  Permission,
  AxiosRequestConfig
>;
export type PermissionsState = ReactReduxRequestState<
  Permission[],
  AxiosRequestConfig
>;
