import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import {
  GlobalState,
  PublicRequestKeys,
  DebateList as DebateListProps,
  encodeLink,
} from '@platonist/library';
import DebateDetail from '../Debate/DebateDetail';
import DebateListComponent from '../Debate/DebateList';
import BlogListComponent from './BlogList';

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

  console.log(path, location.pathname);

  if (path === location.pathname) {
    return <BlogListComponent {...rest} path={encodeLink(path)} />;
    // <div>detail</div>
  }

  if (location.pathname.startsWith(path) && routeProps) {
    return (
    //   <DebateDetail
    //     isAdmin={isAdmin}
    //     path={encodeLink(path)}
    //     routeProps={routeProps}
    //     debateList={rest}
    //   />
    <div>
        hi
    </div>
    );
  }

  return null;
};

export const BlogRoute = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(BlogRouteBase);

export default BlogRoute;
