import { AxiosRequestConfig } from 'axios';

import { User } from '../Models';
import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { Debate } from './Debate';
import { Moderation } from './Moderation';

export interface CommentMeta {
  debateId: number | null;
  moderatorId: number | null;
  userId: number | null;
}

export enum CommentStatus {
  Active = 'active',
  Blocked = 'blocked',
  Disputed = 'disputed',
}

export interface Comment {
  blocked: boolean;
  comment: string;
  created_at: Date | string;
  created_by: User['id'];
  debate: Debate['id'] | Debate;
  disputed: boolean;
  id: string;
  meta?: CommentMeta;
  moderation?: Moderation;
  moderationComment?: string;
  parent: Comment['id'] | Comment | null;
  published_at: number;
  replies: (Comment | null)[] | null;
  replyCount: number;
  status: CommentStatus;
  timestamp: Date | string;
  updated_at: Date | string;
  updated_by: User['id'];
  user: User['id'] | User | null;
}

export type CommentState = ReactReduxRequestState<Comment, AxiosRequestConfig>;
export type CommentsState = ReactReduxRequestState<
  RequestWithPager<Comment[]>,
  AxiosRequestConfig
>;
