import React, { useEffect } from 'react';
import { useAuthentication, useUser } from '../../Hooks';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

export interface PageResendConfirmationProps {}

export const PageResendConfirmation: React.FunctionComponent<
  PageResendConfirmationProps
> = () => {
  const [isAuthenticated] = useAuthentication();
  const {
    user: { result: user },
    send,
  } = useUser<{email: string}>();

  useEffect(() => {
    if (isAuthenticated &&  user && !user.confirmed) {
        const body = {
            email: user.email,
        }
        send({
            method: 'POST',
            pathname: '/auth/send-email-confirmation',
            data: body,
        });
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAuthenticated || user?.confirmed) {
    return <Redirect to="/" />
  }

  return <>
    <div className="section">
    <Container>
        <Row className="offset-md-2 mt-5">
            <Col md={8}>
                <h4>Bestätigungsemail</h4>
                <p>Die Bestätigungs wurde erneut gesendet. Schau mal bitte in deinem Postfach nochmal rein.</p>
                <Link className="btn btn-primary" to="/">Zurück zur Hauptseite</Link>
            </Col>
        </Row>
    </Container>
    </div>
  </>;
};
