import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '@platonist/library';
import { useAuthentication } from '../../Hooks';

export const NavigationPrivate: FunctionComponent = () => {
  const [isAuthenticated] = useAuthentication();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  return isAuthenticated ? (
    <>
      <NavItem>
        <Link className="nav-link" to={'/user/me'} title="My Profile">
          <i className="fa fa-user" /> My Profile
        </Link>
      </NavItem>
      <NavItem>
        <Link
          className="nav-link"
          to={`/auth/logout?target=${location.pathname}`}
        >
          Logout <i className="fa fa-sign-out-alt" />
        </Link>
      </NavItem>
    </>
  ) : (
    <NavItem>
      <Link
        className="nav-link"
        to={`/auth/login?target=${location.pathname}`}
        title="Participate by signing in or up."
      >
        Participate <i className="fa fa-sign-out-alt" />
      </Link>
    </NavItem>
  );
};
