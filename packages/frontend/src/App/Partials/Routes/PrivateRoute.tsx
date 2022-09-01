import React, { FunctionComponent } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAuthentication } from '../../Hooks';
import { PageLogin } from '../Pages';

export const PrivateRoute: FunctionComponent<RouteProps> = (props) => {
  const [isAuthenticated] = useAuthentication();

  return !isAuthenticated ? (
    <PageLogin
      infoText={
        <p>​​Zur Teilnahme an den Debatten ist der Login mit deinem Konto erforderlich. Wenn Du noch kein Konto bei Platonist angelegt hast, registriere dich bitte hier.</p>
      }
    />
  ) : (
    <Route {...props} />
  );
};