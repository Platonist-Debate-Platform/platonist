import { Blog } from '../../Models';
import { StandardActionFn } from '../../Redux';
import { BlogLinkActionKeys } from './Keys';

export const clearBlogLink: StandardActionFn<
  BlogLinkActionKeys.Clear,
  undefined,
  undefined
> = () => ({
  type: BlogLinkActionKeys.Clear,
  payload: undefined,
});

export const setBlogLink: StandardActionFn<
  BlogLinkActionKeys.Set,
  Blog,
  undefined
> = (payload: Blog) => ({
  type: BlogLinkActionKeys.Set,
  payload,
});

export const createBlogLinkAction = () => ({
  clearBlogLink,
  setBlogLink,
});

export const blogLinkAction = createBlogLinkAction();
