import * as React from 'react';
import { Homepage } from '@platonist/library';
import { Container, Row, Col, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';

interface FooterCopyrightProps extends Homepage {}

export const FooterCopyright: React.FunctionComponent<FooterCopyrightProps> = ({
  copyright,
}) => {
  return (
    (copyright && (
      <section className="section section-copyright">
        <Container fluid={true}>
          <Row>
            <Col md={5}>
              {copyright.pages && (
                <Nav className="nav-copy">
                  {copyright.pages.map(
                    (page, index) =>
                      page && (
                        <NavItem key={`nav_copy_item_${page.id}_${index}`}>
                          <Link
                            className="nav-link"
                            to={decodeURI(`/${page.title}`)}
                          >
                            {page.title}
                          </Link>
                        </NavItem>
                      ),
                  )}
                </Nav>
              )}
            </Col>
            <Col md={7} className="text-right">
              <div className="meta meta-copyright">
                <span className="mb-0">{copyright?.title}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    )) ||
    null
  );
};

export default FooterCopyright;
