import React, { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { Col } from 'reactstrap';

import { GlobalState, Homepage, User } from '@platonist/library';
import { useRoutes } from '../../Hooks';
import { AdminListGroup } from '../ListGroup';
import { HomepageResolver } from '../Pages';

const AdminHomepageRoutes: FunctionComponent<Homepage> = (homepage) => {
  const path = `/admin/${homepage.url}`;
  const routes = useRoutes({
    isAdmin: true,
    pages: homepage.pages || [],
    parentPath: path,
  });

  return (
    <>
      <Route
        path={path}
        exact={true}
        render={() => <HomepageResolver {...homepage} isAdmin={true} />}
      />
      {routes.map((route, index) => (
        <Route {...route} key={`admin_route_${index}`} />
      ))}
    </>
  );
};

export const AdminRoutes: FunctionComponent<User> = (props) => {
  const homepages = useSelector((state: GlobalState) => state.homepages);

  return (
    <>
      <Col md={3}>
        <AdminListGroup />
      </Col>
      <Col md={9}>
        {homepages.result &&
          homepages.result.map((homepage, index) => (
            <AdminHomepageRoutes
              {...homepage}
              key={`admin_page_route_${index}`}
            />
          ))}
      </Col>
    </>
  );
};

export default AdminRoutes;
