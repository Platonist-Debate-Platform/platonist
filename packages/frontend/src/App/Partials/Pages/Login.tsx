import { parse } from 'qs';
import React, { FunctionComponent, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { GlobalState, PublicRequestKeys } from '@platonist/library';

import { useAuthentication } from '../../Hooks';
import { Authentication } from '../Authentication';

export interface PageLoginProps {
  infoText?: ReactElement;
  target?: string;
}

export const PageLogin: FunctionComponent<PageLoginProps> = ({
  infoText,
  target,
}) => {
  const [isAuthenticated] = useAuthentication();

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const query = parse(location.search.slice(1)) as { target?: string };
  const redirectTo = query.target || target || '/';

  if (!isAuthenticated) {
    return (
      <section className="section section-authenticate">
        <Container>
          <Row>
            <Col md={8} className="offset-md-2">
              <h2>Login /Registrierung</h2>
              <Authentication infoText={infoText} />
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return <Redirect to={redirectTo} />;
};

export default PageLogin;
