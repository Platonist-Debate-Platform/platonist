import { Author } from './Author';

export interface Contact {
  author?: Author | null;
  email: string;
  id: number;
  lead?: string;
  title: string;
  isFluid: boolean;
}
