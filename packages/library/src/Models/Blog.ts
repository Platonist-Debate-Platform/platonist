import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { Article } from './Article';
import { Comment } from './Comment';
import { ContentKeys } from './Content';

export interface Blog {
  archiveDate: Date;
  archived: boolean;
  id: number;
  isOffline: boolean;
  title: string;
  subTitle: string;
  shortDescription: string;
  published: boolean;
  published_at: number;
  created_at: string;
  updated_at: string;
  comments: (Comment[] | null)[] | null;
}

export interface BlogList {
  __component: ContentKeys;
}

export type BlogState = ReactReduxRequestState<Blog, AxiosRequestConfig>;
export type BlogsState = ReactReduxRequestState<
  RequestWithPager<Blog[]>,
  AxiosRequestConfig
>;
