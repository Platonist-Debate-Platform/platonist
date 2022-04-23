import useRequest, { UseRequestBaseProps } from "./useRequest";

/**
 *
 * @param props
 */
export const useModerations = <Model>(props: UseRequestBaseProps & {path?: string}) => {
  const request = useRequest<Model>({
    ...props,
    path: props.path || 'moderations',
  });

  return request;
};

export default useModerations;