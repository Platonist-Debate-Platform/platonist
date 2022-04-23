import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';

import logoBw from '../../../Assets/Images/Logo/platonist-logo-black.svg';
import Loader from './Loader';

interface LoaderMainProps {}

const LoaderMain: React.FunctionComponent<LoaderMainProps> = (props) => {
  return (
    <>
      <Loader />
      <div className="loader loader-main">
        <Container>
          <Row>
            <Col>
              <img src={logoBw} alt="" width={595} height={187.09} />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoaderMain;
