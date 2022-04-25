import { parse } from 'qs';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';

import {
  alertAction,
  AlertActions,
  AlertTypes,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  ReactReduxRequestActions,
  requestAction,
  RequestStatus,
  ToggleType,
  useConfig,
} from '@platonist/library';

import { useAuthentication } from '../../Hooks';

export const PageLogout: FunctionComponent = () => {
  const authentication = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Authentication]
  >((state) => state[PublicRequestKeys.Authentication]);

  const config = useConfig();
  const dispatch =
    useDispatch<Dispatch<ReactReduxRequestActions | AlertActions>>();
  const [isAuthenticated] = useAuthentication();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const query = parse(location.search.slice(1)) as { target?: string };
  const redirectTo = query.target || '/auth/login';

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/local/logout`;

  useEffect(() => {
    if (
      (isAuthenticated && authentication.status === RequestStatus.Initial) ||
      (isAuthenticated &&
        authentication.status === RequestStatus.Loaded &&
        authentication.result?.status !== 'Unauthorized')
    ) {
      dispatch(
        requestAction.load(PublicRequestKeys.Authentication, {
          method: 'post',
          url: url.href,
          withCredentials: true,
        }),
      );
    }

    if (
      !isAuthenticated &&
      authentication.status === RequestStatus.Loaded &&
      authentication.result?.status === 'Unauthorized'
    ) {
      dispatch(
        alertAction.add({
          id: 'logout_success',
          message: 'You have been logged out successful',
          state: ToggleType.Show,
          type: AlertTypes.Success,
        }),
      );

      dispatch(requestAction.clear(PublicRequestKeys.Authentication));

      Object.keys(PrivateRequestKeys).forEach((key) => {
        dispatch(requestAction.clear(PrivateRequestKeys[key as never]));
      });

      if (!shouldRedirect) {
        setShouldRedirect(true);
      }
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [
    authentication.result?.status,
    authentication.status,
    dispatch,
    isAuthenticated,
    shouldRedirect,
    url.href,
  ]);

  return shouldRedirect ? <Redirect to={redirectTo} /> : null;
};
