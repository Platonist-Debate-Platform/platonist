import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';

import { useAuthentication } from './useAuthentication';

export interface UseRequestSendProps<Data extends Object> {
  data?: Partial<Data>;
  method: 'GET' | 'POST' | 'PUT';
  pathname?: string;
  search?: string;
  headers?: { [key: string]: string };
  get?: boolean;
}

export const useUser = <Data extends Object>(id?: string) => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [isAuthenticated, state] = useAuthentication();
  const url = config.createApiUrl(config.api.config);
  const userId = id || state?.id;
  url.pathname = `users/${userId}`;

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    (state) => state[PrivateRequestKeys.User],
  );

  const send = ({
    data,
    method,
    pathname,
    search,
    get,
  }: UseRequestSendProps<Data>) => {
    let sendUrl: URL | undefined;

    if (pathname) {
      sendUrl = config.createApiUrl(config.api.config);
      sendUrl.pathname = pathname;
      sendUrl.search = search || '';
    }

    if (userId && get) {
      dispatch(
        requestAction.load(PrivateRequestKeys.User, {
          method,
          url: sendUrl?.href || url.href,
          data,
          withCredentials: true,
        }),
      );
    }

    if (userId && isAuthenticated && !get) {
      dispatch(
        requestAction.update(PrivateRequestKeys.User, {
          method,
          url: sendUrl?.href || url.href,
          data,
          withCredentials: true,
        }),
      );
    }
  };

  useEffect(() => {
    if (
      userId &&
      isAuthenticated &&
      user.status === RequestStatus.Initial &&
      !user.result
    ) {
      dispatch(
        requestAction.load(PrivateRequestKeys.User, {
          method: 'GET',
          url: url.href,
          withCredentials: true,
        }),
      );
    }
  }, [dispatch, isAuthenticated, user, url.href, state?.status, userId]);

  return { user, send };
};

export default useUser;
