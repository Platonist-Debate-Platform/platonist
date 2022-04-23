import { AxiosRequestConfig } from 'axios';

import { ReactReduxRequestState } from '../ReactReduxRequest';
import { Author } from './Author';
import { Content } from './Content';
import { Image } from './Image';
import { Logo } from './Logo';
import { Meta } from './Meta';
import { Page } from './Page';
import { Contact } from './Contact';
import { SocialItem } from './Social';
import { Copyright } from './Copyright';

export interface Homepage {
  active: boolean;
  admin: Author;
  contact: Contact;
  content?: (Content | null)[] | null;
  copyright?: Copyright | null;
  created_at: Date;
  id: number;
  image?: Image | null;
  logo: Logo;
  meta?: (Meta | null)[] | null;
  pages?: (Page | null)[] | null;
  title: string;
  tools?: SocialItem | null;
  updated_at: Date;
  url: string;
  menuTitle: string;
}

export type HomepageState = ReactReduxRequestState<
  Homepage,
  AxiosRequestConfig
>;
export type HomepagesState = ReactReduxRequestState<
  Homepage[],
  AxiosRequestConfig
>;
