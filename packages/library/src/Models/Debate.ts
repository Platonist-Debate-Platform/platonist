import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { Article } from './Article';
import { Comment } from './Comment';
import { ContentKeys } from './Content';

export interface Debate {
  archiveDate: Date;
  archived: boolean;
  id: number;
  isOffline: boolean;
  title: string;
  subTitle: string;
  shortDescription: string;
  articleB: Article | Partial<Article> | null;
  articleA: Article | Partial<Article> | null;
  published: boolean;
  published_at: number;
  created_at: string;
  updated_at: string;
  comments: (Comment[] | null)[] | null;
}

export interface DebateList {
  __component: ContentKeys;
}

export type DebateState = ReactReduxRequestState<Debate, AxiosRequestConfig>;
export type DebatesState = ReactReduxRequestState<
  RequestWithPager<Debate[]>,
  AxiosRequestConfig
>;
