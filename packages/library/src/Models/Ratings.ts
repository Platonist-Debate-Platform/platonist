import { Article } from './Article';

export interface Ratings {
  id: string;
  relevance: number;
  argumentation: number;
  quality: number;
  user: string;
  articles: (Article | null)[] | null;
  published_at: number;
  created_by: Date | string;
  updated_by: Date | string;
}
