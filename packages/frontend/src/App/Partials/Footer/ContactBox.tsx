import { Contact, GlobalState, PublicRequestKeys } from '@platonist/library';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { Image } from '../Image';

interface ContactBoxProps {
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  contact: Contact;
}

export const ContactBoxBase: FC<ContactBoxProps> = (props) => {
  const { page, router } = props;

  const pageContact = page.result && page.result.contact;
  const homepageContact =
    router.location.pathname === '/' ? props.contact : null;
  const contact = pageContact || homepageContact || null; // props.contact;

  return (
    contact &&
    ((router.location.pathname !== '/404' && (
      <section className="section section-contact">
        <div className="contact">
          <Container>
            <Row>
              <Col className="text-center mb-5">
                <h3 className="h2">{contact.title}</h3>
                {contact.lead && <p className="lead">{contact.lead}</p>}
              </Col>
            </Row>
          </Container>
          {contact.author && (
            <Container fluid={true} className="p-0">
              <Row className="align-items-end p-0 m-0">
                <Col md={6} className="m-0 p-0">
                  {contact.author.image && (
                    <Image className="contact-img" {...contact.author.image} />
                  )}
                </Col>
                <Col md={4} className="offset-md-1 mr-0 p-0">
                  <div className="contact-text">
                    <h3>
                      {contact.author.firstName} {contact.author.lastName}
                      {contact.author.jobTitle && (
                        <small>{contact.author.jobTitle}</small>
                      )}
                    </h3>
                    <p className="mb-5">{contact.author.shortDescription}</p>
                    <p className="mb-4 contact-data">
                      <a href={`tel:${contact.author.phone}`}>
                        <i className="icon-phone" />
                        {contact.author.phone}
                      </a>{' '}
                      <br />
                      <a href={`mailto:${contact.email}`}>
                        <i className="icon-mail" /> {contact.email}
                      </a>
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </div>
      </section>
    )) ||
      null)
  );
};

export const ContactBox = connect((state: GlobalState) => ({
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(ContactBoxBase);

export default ContactBox;
