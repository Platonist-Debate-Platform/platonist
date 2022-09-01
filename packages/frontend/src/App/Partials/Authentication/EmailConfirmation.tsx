import './EmailConfirmation.scss';

import React, { FunctionComponent, useState } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';
import { useAuthentication } from '../../Hooks';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GlobalState, PrivateRequestKeys } from '@platonist/library';

export const EmailConfirmation: FunctionComponent<{}> = () => {
  const [isAuthenticated] = useAuthentication();
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);

  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  if (
    !isAuthenticated ||
    (isAuthenticated && !user) ||
    (isAuthenticated && user && user.confirmed)
  ) {
    return null;
  }

  return (
    <div className="authentication-email-confirmation">
      <Container>
        <Row>
          <Col>
            <Alert color="info" isOpen={visible} toggle={onDismiss}>
              Dein Profil ist noch nicht bestätigt. Bitte überprüfe Deinen
              Postfach. Wenn du keine Mail erhalten hast,{' '}
              <Link className="alert-link" to="/user/me?modal=change-email">
                ändere Deine Emailadresse. {' '}
              </Link>{' '}
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
