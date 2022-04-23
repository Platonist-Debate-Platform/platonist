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
              Your account email is not confirmed, please check your mailbox and
              double opt-in. If you didn't get the mail please{' '}
              <Link className="alert-link" to="/user/me?modal=change-email">
                change your email{' '}
              </Link>{' '}
              or{' '}
              <Link className="alert-link" to="/auth/resend-confirmation">
                resend confirmation
              </Link>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
