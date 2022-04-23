import { isArray } from 'lodash';
import {
  alertAction,
  AlertAddPayload,
  AlertDispatch,
  AlertPayload,
  getStrapiErrorMessages,
  ReactReduxRequestErrorMessage,
  StrapiErrorMessage,
  ToggleType,
} from '@platonist/library';
import React, { FunctionComponent } from 'react';
import { Alert, Fade } from 'reactstrap';

import { AlertsProgress } from './AlertsProgress';

export interface AlertsDetailProps {
  alert: AlertPayload | AlertAddPayload;
  dispatch: AlertDispatch;
}

const AlertMessage: FunctionComponent<{
  id: string;
  messages: ReactReduxRequestErrorMessage[] | StrapiErrorMessage[];
}> = (props) => {
  const messages =
    props.messages.length > 0 &&
    (props.messages[0] as StrapiErrorMessage).messages
      ? getStrapiErrorMessages(props.messages as StrapiErrorMessage[])
      : (props.messages as ReactReduxRequestErrorMessage[]);

  if (!messages) {
    return <>Something went wrong!</>;
  }

  return (
    <ul>
      {messages.map((message, index) => {
        return (
          <li key={`error_message_${props.id}_${index}`}>{message.message}</li>
        );
      })}
    </ul>
  );
};

export const AlertsDetail: FunctionComponent<AlertsDetailProps> = ({
  alert,
  dispatch,
}) => {
  const isOpen = alert.state && alert.state === ToggleType.Show ? true : false;

  const onDismiss = () => {
    if (alert.state && alert.state === ToggleType.Show) {
      dispatch(
        alertAction.hide({
          id: alert.id,
          message: alert.message as string,
          type: alert.type,
        }),
      );

      setTimeout(
        () =>
          dispatch(
            alertAction.remove({
              id: alert.id,
              message: alert.message as string,
              type: alert.type,
            }),
          ),
        3000,
      );
    }
  };

  return (
    <Fade in={isOpen}>
      <Alert color={alert.type} toggle={onDismiss}>
        <AlertsProgress done={onDismiss} type={alert.type} />
        {!isArray(alert.message) ? (
          alert.message || `Something went wrong!`
        ) : (
          <>
            <AlertMessage id={alert.id} messages={alert.message} />
          </>
        )}
      </Alert>
    </Fade>
  );
};

export default AlertsDetail;
