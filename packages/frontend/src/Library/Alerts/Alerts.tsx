import './Alerts.scss';

import { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import { AlertsList } from './AlertsList';

import {
  GlobalState,
  PublicRequestKeys,
  AlertDispatch,
  AlertTypes,
} from '@platonist/library';

export interface AlertProps {
  [PublicRequestKeys.Alerts]: GlobalState[PublicRequestKeys.Alerts];
  dispatch: AlertDispatch;
}

export const AlertsWithoutState: FunctionComponent<AlertProps> = (props) => {
  const { alerts, dispatch } = props;

  const alertKeys = Object.keys(
    props.alerts,
  ) as (keyof GlobalState[PublicRequestKeys.Alerts])[] as AlertTypes[];
  const hasAlerts = alertKeys.some((key) => alerts[key].length > 0);

  return hasAlerts ? (
    <div className="alerts-wrap">
      {alertKeys.map((key, index) => {
        const alertCategory = alerts[key];
        return alertCategory && alertCategory.length > 0 ? (
          <AlertsList
            alerts={alertCategory}
            alertType={key}
            dispatch={dispatch}
            key={`alert_${key}_${index}`}
          />
        ) : null;
      })}
    </div>
  ) : null;
};

export const Alerts = connect((state: GlobalState) => ({
  [PublicRequestKeys.Alerts]: state[PublicRequestKeys.Alerts],
}))(AlertsWithoutState);

export default Alerts;
