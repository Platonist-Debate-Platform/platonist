import React, { FunctionComponent } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuthentication } from '../../Hooks';
import { PageLogin } from '../Pages';

export const PrivateRoute: FunctionComponent<RouteProps> = (props) => {
  const [isAuthenticated] = useAuthentication();

  return !isAuthenticated ? (
    <PageLogin
      infoText={
        <p>In order to see this page you'll have to sign in. If you don't have an account you could register an account.</p>
      }
    />
  ) : (
    <Route {...props} />
  );
};