import { ContentKeys } from './Content';
import { Image } from './Image';
import { Page } from './Page';

// eslint-disable-next-line no-shadow
export enum TextAlign {
  Center = 'center',
  Full = 'full',
  Left = 'left',
  Right = 'right',
}

export interface Jumbotron {
  __component: ContentKeys;
  callToAction?: string | null;
  disableBackground?: boolean;
  hasShape?: boolean;
  isFluid: boolean;
  isFullScreen: boolean;
  media?: Image | null;
  page?: Page | null;
  teaser?: string | null;
  textAlign: TextAlign;
  title: string;
  titleSmall?: string;
}
