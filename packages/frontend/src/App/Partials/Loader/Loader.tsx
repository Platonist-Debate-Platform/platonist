import * as React from 'react';
import { connect } from 'react-redux';
import {
  GlobalState,
  ReactReduxRequestState,
  RequestStatus,
} from '@platonist/library';
import { AxiosRequestConfig } from 'axios';
import { Spinner } from 'reactstrap';
import classNames from 'classnames';

interface LoaderProps {
  status: RequestStatus[];
}

const LoaderBase: React.FunctionComponent<LoaderProps> = ({ status }) => {
  const isUpdating = status.some((state) => state === RequestStatus.Updating);

  return (
    <div
      className={classNames('loader-indicator', {
        active: isUpdating,
      })}
    >
      <div className="loader-indicator-inner">
        <span className="lead">Loading...</span>
        <Spinner type="grow" />
      </div>
    </div>
  );
};

export const Loader = connect((globalState: GlobalState) => {
  const status: RequestStatus[] = [];
  Object.keys(globalState).forEach((key) => {
    const state = globalState[
      key as keyof GlobalState
    ] as ReactReduxRequestState<any, AxiosRequestConfig>;
    if (state && state.status && state.hash) {
      status.push(state.status);
    }
  });
  return {
    status,
  };
})(LoaderBase);

export default Loader;
