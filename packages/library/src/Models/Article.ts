import { AxiosRequestConfig } from 'axios';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Ratings } from './Ratings';

export interface Article {
  id: number;
  isOffline: boolean;
  description: string;
  icon: string | null;
  image: string | null;
  key?: string;
  keywords: string | null;
  title: string;
  language: string;
  type: string;
  url: string;
  provider: string;
  published_at: number;
  ratings: (Ratings | null)[] | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export type ArticleState = ReactReduxRequestState<Article, AxiosRequestConfig>;
export type ArticlesState = ReactReduxRequestState<
  Article[],
  AxiosRequestConfig
>;
