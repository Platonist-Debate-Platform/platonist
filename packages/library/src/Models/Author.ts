import { Image } from './Image';
import { Homepage } from './Homepage';

export interface Author {
  about?: string | null;
  active: boolean;
  created_at: Date;
  email?: string;
  firstName: string;
  homepage?: number | Homepage | null;
  id: number;
  image?: Image | null;
  jobTitle?: string;
  lastName: string;
  phone?: string | null;
  shortDescription: string;
  updated_at: Date;
  userInfo?: number | Author | null;
}
