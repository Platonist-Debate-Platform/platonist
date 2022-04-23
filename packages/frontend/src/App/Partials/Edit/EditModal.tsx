import { Location } from 'history';
import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { GlobalState, PublicRequestKeys } from '@platonist/library';

export interface EditModalProps {
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  className?: string;
  children: ReactNode;
  pathname: string;
}

const showModal = (pathname: string, location: Location) => {
  if (!location.search.length) {
    return false;
  }

  return location.pathname + location.search === pathname;
};

export const EditModalWithoutState: FunctionComponent<EditModalProps> = ({
  className,
  children,
  pathname,
  router,
}) => {
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
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Do Something
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {redirect && <Redirect to={router.location.pathname} />}
    </>
  );
};

export const EditModal = connect((state: GlobalState) => ({
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(EditModalWithoutState);

export default EditModal;
