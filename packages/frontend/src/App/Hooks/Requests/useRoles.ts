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

export const useRoles = (
  key: PrivateRequestKeys.Role | PrivateRequestKeys.Roles,
  id?: string,
) => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const [isAuthenticated, state] = useAuthentication();

  const roles = useSelector<GlobalState, GlobalState[typeof key]>(
    (state) => state[key],
  );

  const url = config.createApiUrl(config.api.config);
  url.pathname = `users-permissions/roles${(id && '/' + id) || ''}`;

  useEffect(() => {
    if (key === PrivateRequestKeys.Role && !id) {
      return;
    }
    if (isAuthenticated && roles.status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(key, {
          method: 'GET',
          url: url.href,
          withCredentials: true,
        }),
      );
    }
  }, [dispatch, isAuthenticated, key, roles, url.href, state?.status, id]);

  return roles;
};

export default useRoles;
