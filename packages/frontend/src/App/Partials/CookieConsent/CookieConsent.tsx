import './CookieConsent.scss';

// eslint-disable-next-line
import React, { FunctionComponent } from 'react';
import { useCookie } from 'react-use';
import { Button, Col, Container, Row } from 'reactstrap';

export const CookieConsent: FunctionComponent = () => {
  const [value, updateCookie] = useCookie('cookie-consent');
  
  const updateCookieHandler= () => {
    updateCookie('true')
  }

  return !Boolean(value) ? (
    <div className="cookie-consent">
      <Container fluid={true}>
        <Row>
          <Col md={6}>
            We are using cookies
          </Col>
          <Col md={6}>
            <Button color="green" onClick={() => updateCookieHandler()}>
              Accept
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  ) : null;
}