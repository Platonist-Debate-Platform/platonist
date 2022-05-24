import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import {
  GlobalState,
  PublicRequestKeys,
  DebateList as DebateListProps,
  encodeLink,
} from '@platonist/library';
import BlogListComponent from './BlogList';
import BlogArticlePage from './BlogArticlePage';

export interface BlogRouteProps extends DebateListProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: unknown;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export const BlogRouteBase: React.FC<BlogRouteProps> = (props) => {
  const { dispatch, isAdmin, path, routeProps, router, ...rest } = props;
  const [location, setLocation] = useState(router.location);

  useEffect(() => {
    if (router.location.key !== location.key) {
      setLocation(router.location);
    }
  }, [location, router.location, setLocation]);

  if (path === location.pathname) {
    return <BlogListComponent {...rest} path={encodeLink(path)} />;
  }

  if (location.pathname.startsWith(path) && routeProps) {
    return (
      <BlogArticlePage
        isAdmin={isAdmin}
        path={encodeLink(path)}
        routeProps={routeProps}
        {...rest}
      />
    );
  }

  return null;
};

export const BlogRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(BlogRouteBase);

export default BlogRoute;
