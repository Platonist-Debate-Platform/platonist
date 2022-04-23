import { Location } from 'history';
import React, {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '@platonist/library';

export interface ModalAutomaticProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  children: ReactNode;
  className?: string;
  modalHeader?: ReactElement<any, any>;
  pathname: string;
  showFooter?: boolean;
}

const showModal = (pathname: string, location: Location) => {
  if (!location.search.length) {
    return false;
  }

  return location.pathname + location.search === pathname;
};

export const ModalAutomaticWithoutState: FunctionComponent<
  ModalAutomaticProps
> = ({ children, className, modalHeader, pathname, router, showFooter }) => {
  const [modal, setModal] = useState(showModal(pathname, router.location));
  const [redirect, setRedirect] = useState(false);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    setModal(showModal(pathname, router.location));
    setRedirect(false);
  }, [router, pathname]);

  return (
    <>
      <Modal
        size="lg"
        isOpen={modal}
        className={className}
        onClosed={() => setRedirect(true)}
      >
        <ModalHeader toggle={toggle}>{modalHeader || ''}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        {showFooter && (
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        )}
      </Modal>
      {redirect && <Redirect to={router.location.pathname} />}
    </>
  );
};

export const ModalAutomatic = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(ModalAutomaticWithoutState);

export default ModalAutomatic;
