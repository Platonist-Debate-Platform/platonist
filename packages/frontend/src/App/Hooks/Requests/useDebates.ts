import { UseRequestBaseProps, useRequest } from './useRequest';

export const useDebates = <Model>(props: UseRequestBaseProps) => {
  const request = useRequest<Model>({
    ...props,
    path: 'debates',
  });

  return request;
};

export default useDebates;
