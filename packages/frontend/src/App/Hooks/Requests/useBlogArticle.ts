import { PrivateRequestKeys, Blog } from '@platonist/library';
import useRequest from './useRequest';

export const useBlogArticle = (id: Blog['id'], stateOnly: boolean = true) => {
  return useRequest<Blog>({
    id: Number(id),
    key: PrivateRequestKeys.Blog,
    path: 'blog-articles',
    stateOnly,
  });
};

export default useBlogArticle;
