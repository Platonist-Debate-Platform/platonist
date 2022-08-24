import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '@platonist/library';
import { useAuthentication } from '../../Hooks';
import { GERMAN } from '../../i18n';

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
          <i className="fa fa-user" /> Mein Profil
        </Link>
      </NavItem>
      <NavItem>
        <Link
          className="nav-link"
          to={`/auth/logout?target=${location.pathname}`}
        >
          Ausloggen <i className="fa fa-sign-out-alt" />
        </Link>
      </NavItem>
    </>
  ) : (
    <NavItem>
      <Link
        className="nav-link"
        to={`/auth/login?target=${location.pathname}`}
        title="Nehme teil!"
      >
        {GERMAN.participate} <i className="fa fa-sign-out-alt" />
      </Link>
    </NavItem>
  );
};
