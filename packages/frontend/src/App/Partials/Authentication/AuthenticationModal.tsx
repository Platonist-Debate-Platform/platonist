import './AuthenticationModal.scss';

import React, { FunctionComponent } from 'react';
import { Col, Row } from 'reactstrap';

import { ModalAutomatic } from '../Modal';
import { Authentication } from './Authentication';

export interface AuthenticationModalProps {
  pathname: string;
}

export const AuthenticationModal: FunctionComponent<AuthenticationModalProps> = ({
  pathname,
}) => {
  return (
    <ModalAutomatic 
      pathname={pathname}
      modalHeader={<>Authentication</>}
    >
      <Row>
        <Col md={8} className="offset-md-2">
          <Authentication />
        </Col>
      </Row>
    </ModalAutomatic>
  );
}