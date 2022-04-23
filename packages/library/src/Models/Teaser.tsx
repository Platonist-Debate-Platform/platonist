import { ContentKeys } from "./Content";

export interface Teaser {
  __component: ContentKeys;
  id: number;
  title: string;
  lead: string;
  isFluid: boolean;
}
