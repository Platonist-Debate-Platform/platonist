import { UseRequestBaseProps, useRequest } from './useRequest';

export const useBlogArticles = <Model>(props: UseRequestBaseProps) => {
  const request = useRequest<Model>({
    ...props,
    path: 'blog-articles',
  });

  return request;
};

export default useBlogArticles;
