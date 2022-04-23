import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { ContentKeys } from './Content';
import { Image } from './Image';
import { Role } from './Role';

export interface User {
  avatar?: Image | null;
  avatarOriginal?: Image | null;
  blocked?: boolean | null;
  confirmed?: boolean | null;
  email: string;
  id: string;
  password: string;
  provider: string;
  resetPasswordToken: string;
  role?: Role | null;
  username: string;
  firstName: string;
  lastName: string;
}

export interface UserList {
  __component: ContentKeys;
}

export type UserState = ReactReduxRequestState<User, AxiosRequestConfig>;
