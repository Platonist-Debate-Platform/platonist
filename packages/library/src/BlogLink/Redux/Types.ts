import { Blog } from '../../Models';
import { clearBlogLink, setBlogLink } from './Actions';

export interface BlogLinkState {
  blog?: Blog;
  id?: Pick<Blog, 'id'>;
}

export type BlogLinkActions =
  | ReturnType<typeof clearBlogLink>
  | ReturnType<typeof setBlogLink>;

export interface BlogLinkDispatch {
  <A extends BlogLinkActions>(action: A): A;
}
