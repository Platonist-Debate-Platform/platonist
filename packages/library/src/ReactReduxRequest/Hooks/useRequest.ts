import { AxiosRequestConfig } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { requestAction } from '../CreateAction';
import { ReactReduxRequestDispatch, ReactReduxRequestState } from '../Types';

export interface UseRequestProps<State extends Object> {
  config: AxiosRequestConfig;
  key: keyof State;
  method: keyof typeof requestAction;
}

export const useRequest = <
  Model,
  RequestModel extends ReactReduxRequestState<Model, AxiosRequestConfig>,
  State extends { [key: string]: RequestModel },
>(
  props: UseRequestProps<State>,
): ReactReduxRequestState<Model, AxiosRequestConfig> => {
  const { config, key, method } = props;

  const data: RequestModel = useSelector<State, RequestModel>(
    (state) => state[key],
  );
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const action = requestAction[method];

  useEffect(() => {
    dispatch((action as any)(key, config));
  });

  return data;
};
