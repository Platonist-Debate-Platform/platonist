import React from 'react';

import { Teaser as TeaserProps } from '@platonist/library';
import { ContentResolverItemDefaultProps } from '../ContentResolver';
import { Container, Row, Col } from 'reactstrap';

import shadeRight from '../../../../Assets/Images/gct_circle-shape_right.svg';

export const Teaser: React.FC<
  TeaserProps & ContentResolverItemDefaultProps
> = ({ lead, title, isFluid }) => {
  let style;
  let classNameRow = 'align-items-end';
  let classNameCol = '';

  style = {
    backgroundImage: `url(${shadeRight})`,
  };
  if (!isFluid) {
    style = {
      height: `30vh`,
    };
    classNameRow = '';
    classNameCol = 'offset-md-3 text-center';
  }

  return (
    <section className="section section-teaser" style={style}>
      <div className="teaser">
        <Container fluid={true}>
          <Row className={classNameRow}>
            <Col md={6} className={classNameCol}>
              <h2>{title}</h2>
              <p className="lead">{lead}</p>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Teaser;
