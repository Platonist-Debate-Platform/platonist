import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCookie } from 'react-use';

import {
  GlobalState,
  PublicRequestKeys,
  RequestStatus,
} from '@platonist/library';

export interface AuthCookie {
  status: string;
  id: string;
}

export type UseAuthentication = [boolean, AuthCookie | undefined];

const authenticationChecker = (
  state: GlobalState[PublicRequestKeys.Authentication],
): boolean =>
  state.status === RequestStatus.Loaded &&
  state.result?.status === 'Authenticated'
    ? true
    : false;

const cookieMaxAge = 1000 * 60 * 60 * 24 * 14;

export const useAuthentication = (): UseAuthentication => {
  const authentication = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Authentication]
  >((state) => state[PublicRequestKeys.Authentication]);

  const [cookie, setAuthCookie, deleteAuthCookie] = useCookie(
    'AuthenticationStatus',
  );

  const authCookie =
    (cookie && (JSON.parse(cookie) as AuthCookie)) || undefined;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    (authCookie &&
      authCookie.status &&
      authCookie.status === 'Authenticated' &&
      true) ||
      authenticationChecker(authentication),
  );

  useEffect(() => {
    if (
      !authCookie &&
      isAuthenticated !== authenticationChecker(authentication)
    ) {
      setIsAuthenticated(authenticationChecker(authentication));
    }

    if (!authCookie && isAuthenticated && authentication.result) {
      setAuthCookie(
        JSON.stringify({
          status: authentication.result.status,
          id: authentication.result.id,
        } as AuthCookie),
        {
          expires: new Date(Date.now() + cookieMaxAge),
          sameSite: 'strict',
        },
      );
    }

    if (isAuthenticated && authentication.result?.status === 'Unauthorized') {
      deleteAuthCookie();
      setIsAuthenticated(false);
    }
  }, [
    authCookie,
    authentication,
    deleteAuthCookie,
    isAuthenticated,
    setAuthCookie,
  ]);

  return [isAuthenticated, authCookie];
};
