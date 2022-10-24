import * as React from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { GlobalState, Homepage, PublicRequestKeys } from '@platonist/library';
import { Navigation } from '../Navbar';
import { NavigationType } from '../Navbar/Keys';

interface FooterProps {
  [PublicRequestKeys.Pages]: GlobalState[PublicRequestKeys.Pages];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  homepage: Homepage;
}

export const FooterBase: React.FunctionComponent<FooterProps> = ({
  homepage,
  pages,
  router,
}) => {
  const result = pages?.result || homepage.pages || [];
  return (
    <section className="section section-footer">
      <Container fluid={true}>
        <Row>
          <Col md={12}>
            <h4>{homepage.title}</h4>
          </Col>
        </Row>
        <Row>
          <Col md={9}>
            {result && result.length > 0 && (
              <Navigation
                className={'nav-footer'}
                navFor={NavigationType.Footer}
                isHomepage={router.location.pathname === '/'}
                level={1}
                pages={result}
                tools={homepage.tools}
                toggled={false}
              />
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export const Footer = connect((state: GlobalState) => ({
  [PublicRequestKeys.Pages]: state[PublicRequestKeys.Pages],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(FooterBase);

export default Footer;
