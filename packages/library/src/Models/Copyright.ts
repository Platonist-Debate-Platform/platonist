import { Page } from './Page';

export interface Copyright {
  id: number;
  pages: (Page | null)[] | null;
  title: string;
}
