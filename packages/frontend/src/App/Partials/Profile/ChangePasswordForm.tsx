import { stringify } from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { GlobalState, PublicRequestKeys } from '@platonist/library';
import { ChangePassword } from '../Authentication';
import { ModalWithRoute } from '../Modal';

export const ProfileChangePasswordForm: FunctionComponent = () => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const [shouldReset, setShouldReset] = useState(false);

  const queryParameter =
    '?' +
    stringify({
      modal: 'change-password',
    });

  const handleClose = useCallback(() => {
    if (!shouldReset) {
      setShouldReset(true);
    }
  }, [shouldReset]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
    }
  }, [shouldReset]);

  return (
    <ModalWithRoute
      from={location.pathname}
      header="Change Password"
      onClosed={handleClose}
      to={location.pathname + queryParameter}
    >
      <ChangePassword redirectTarget={location.pathname} reset={shouldReset} />
    </ModalWithRoute>
  );
};
