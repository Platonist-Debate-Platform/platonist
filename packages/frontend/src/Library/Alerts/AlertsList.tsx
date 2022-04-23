import {
  AlertAddPayload,
  AlertDispatch,
  AlertPayload,
  AlertTypes,
} from '@platonist/library';
import React, { FunctionComponent } from 'react';

import { AlertsDetail } from './AlertsDetail';

export interface AlertsListProps {
  alerts: (AlertPayload | AlertAddPayload)[];
  alertType: AlertTypes;
  dispatch: AlertDispatch;
}

export const AlertsList: FunctionComponent<AlertsListProps> = (props) => {
  const { alerts, dispatch } = props;

  return (
    <>
      {alerts.map((alert, index) => (
        <AlertsDetail
          alert={alert}
          dispatch={dispatch}
          key={`alerts_list_${alert.type}_${alert.id}_${index}`}
        />
      ))}
    </>
  );
};

export default AlertsList;
