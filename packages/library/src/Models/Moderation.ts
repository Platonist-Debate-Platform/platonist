import { AxiosRequestConfig } from 'axios';

import { User } from '../Models';
import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { CommentStatus, Comment } from './Comment';

export interface Moderation {
  created_by?: User['id'];
  comment?: Comment['id'] | Comment;
  id: number;
  reason?: string;
  status: CommentStatus;
  updated_at: Date | string;
  updated_by: User['id'];
  moderator: User['id'] | User | null;
}

export type ModerationState = ReactReduxRequestState<
  Moderation,
  AxiosRequestConfig
>;

export type ModerationsState = ReactReduxRequestState<
  RequestWithPager<Moderation[]>,
  AxiosRequestConfig
>;
