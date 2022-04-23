import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Contact } from './Contact';
import { Content } from './Content';
import { Homepage } from './Homepage';
import { Meta } from './Meta';

export interface Page {
  active: boolean;
  contact: Contact | null;
  content: (Content | null)[] | null;
  created_at: Date;
  homepage?: Homepage | null;
  id: number;
  inFooter: boolean;
  inNavigation: boolean;
  meta?: (Meta | null)[] | null;
  name?: string | null;
  page?: Page | null;
  pages?: (Page | null)[] | null;
  title: string;
  updated_at: Date;
  parentPage: Page | null;
}

export type PageState = ReactReduxRequestState<Page, AxiosRequestConfig>;
export type PagesState = ReactReduxRequestState<Page[], AxiosRequestConfig>;
