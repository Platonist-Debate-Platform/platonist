import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState, RequestWithPager } from '../ReactReduxRequest';
import { Content, ContentKeys } from './Content';

export interface ContentType {
  __component: ContentKeys;
}

export interface Blog {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  published_at: number;
  created_at: string;
  updated_at: string;
  articleImage: any;
  content: Content[];
}

export interface BlogList {
  __component: ContentKeys;
}

export type BlogState = ReactReduxRequestState<Blog, AxiosRequestConfig>;
export type BlogsState = ReactReduxRequestState<
  RequestWithPager<Blog[]>,
  AxiosRequestConfig
>;
