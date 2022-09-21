import { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  GlobalState,
  PublicRequestKeys,
  RequestStatus,
} from '@platonist/library';
import { useAuthentication } from '../../Hooks';
import useUser from '../../Hooks/Requests/useUser';

export const PageEmailConfirmation: FunctionComponent = () => {
  const [isAuthenticated] = useAuthentication();

  const {
    user: { result: user, status },
    send,
  } = useUser();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [successful, setSuccessful] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.confirmed && !successful) {
      send({
        method: 'GET',
        pathname: '/auth/email-confirmation',
        search: location.search,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    !isAuthenticated ||
    (isAuthenticated && !user) ||
    (isAuthenticated && user && user.confirmed)
  ) {
    return <>{status === RequestStatus.Loaded && <Redirect to="/" />}</>;
  }

  return <section className="section section-authenticate"></section>;
};
