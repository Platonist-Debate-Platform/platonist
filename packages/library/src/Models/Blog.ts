import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { Article } from './Article';
import { Comment } from './Comment';
import { ContentKeys } from './Content';

export interface Blog {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  published_at: number;
  created_at: string;
  updated_at: string;
  articleImage: any;
  content: any;
}

export interface BlogList {
  __component: ContentKeys;
}

export type BlogState = ReactReduxRequestState<Blog, AxiosRequestConfig>;
export type BlogsState = ReactReduxRequestState<
  RequestWithPager<Blog[]>,
  AxiosRequestConfig
>;
