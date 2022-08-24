import './CookieConsent.scss';

// eslint-disable-next-line
import React, { FunctionComponent } from 'react';
import { useCookie } from 'react-use';
import { Button, Col, Container, Row } from 'reactstrap';

export const CookieConsent: FunctionComponent = () => {
  const [value, updateCookie] = useCookie('cookie-consent');

  const updateCookieHandler = () => {
    updateCookie('true');
  };

  return !Boolean(value) ? (
    <div className="cookie-consent">
      <Container fluid={true}>
        <Row>
          <Col md={6}>Wir benutzen Cookies.</Col>
          <Col md={6}>
            <Button color="green" onClick={() => updateCookieHandler()}>
              Akzeptieren
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  ) : null;
};
