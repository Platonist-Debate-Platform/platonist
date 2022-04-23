import { Image, MediaPosition, MediaSize } from './Image';
import { ContentKeys } from './Content';

export interface Text {
  __component: ContentKeys;
  active: boolean;
  content: string;
  id: number;
  isFluid: boolean;
  title: string;
}

export interface TextWithImage extends Text {
  media?: (Image | null)[] | null;
  mediaPosition: MediaPosition;
  mediaSize: MediaSize;
  showCaption: boolean;
}

export interface TextWithListItem {
  __component?: ContentKeys;
  content: string;
  id: number;
}

export interface TextWithList extends Text {
  items: (TextWithImage | null)[] | null;
}
