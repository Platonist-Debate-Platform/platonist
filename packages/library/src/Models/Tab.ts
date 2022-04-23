import { Media } from 'reactstrap';
import { ContentKeys } from './Content';
import { Page } from './Page';
import { Image } from './Image';
import { Icon } from './Icon';

export interface TabItem<Item> {
  callToAction?: string | null;
  icon?: Icon;
  id: number;
  item?: Item;
  lead?: string | Media;
  media?: Image | null;
  teaser?: string | null;
  title?: string;
}

export interface Tab {
  __component: ContentKeys;
  id: number;
  tabItem?: (TabItem<Page> | null)[] | null;
  title?: string;
}
