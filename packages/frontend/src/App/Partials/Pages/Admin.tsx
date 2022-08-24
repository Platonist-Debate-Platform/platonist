import classNames from 'classnames';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import {
  GlobalState,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';

import { useAuthentication } from '../../Hooks';
import { AdminRoutes } from '../Routes';

export const PageAdmin: FunctionComponent = () => {
  const config = useConfig();
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/users`;

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    (state) => state[PrivateRequestKeys.User],
  );
  const [isAuthenticated, state] = useAuthentication();

  const showLoginForm =
    (!isAuthenticated && !user.result) || (isAuthenticated && !user.result)
      ? true
      : false;

  useEffect(() => {
    if (isAuthenticated && state && user.status === RequestStatus.Initial) {
      url.pathname = `${url.pathname}/${state.id}`;

      dispatch(
        requestAction.load(PrivateRequestKeys.User, {
          url: url.href,
          withCredentials: true,
        }),
      );
    }
  });

  return (
    <section
      className={classNames('section', {
        'section-login': showLoginForm,
        'section-admin': !showLoginForm,
      })}
    >
      <Container fluid={true}>
        <Row>
          {showLoginForm && (
            <Col>
              <p>
                Bitte <Link to="/auth/login">einloggen</Link>
              </p>
            </Col>
          )}
          {isAuthenticated && user.result && <AdminRoutes {...user.result} />}
        </Row>
      </Container>
    </section>
  );
};

export default PageAdmin;
