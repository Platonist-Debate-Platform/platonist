import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import {
  GlobalState,
  PublicRequestKeys,
  DebateList as DebateListProps,
  encodeLink,
} from '@platonist/library';
import DebateDetail from './DebateDetail';
import DebateListComponent from './DebateList';

export interface DebateRouteProps extends DebateListProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: unknown;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const DebateRouteBase: React.FC<DebateRouteProps> = (props) => {
  const { dispatch, isAdmin, path, routeProps, router, ...rest } = props;
  const [location, setLocation] = useState(router.location);

  useEffect(() => {
    if (router.location.key !== location.key) {
      setLocation(router.location);
    }
  }, [location, router.location, setLocation]);

  if (path === location.pathname) {
    return <DebateListComponent {...rest} path={encodeLink(path)} />;
  }

  if (location.pathname.startsWith(path) && routeProps) {
    return (
      <DebateDetail
        isAdmin={isAdmin}
        path={encodeLink(path)}
        routeProps={routeProps}
        debateList={rest}
      />
    );
  }

  return null;
};

export const DebateRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(DebateRouteBase);

export default DebateRoute;
