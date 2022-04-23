import { Component, ComponentType, useContext } from 'react';

import { ConfigContext } from './Context';
import { createApiUrl } from './DefaultConfig';
import { ConfigContextValues } from './Types';

export interface WithConfigProps {
  config?: ConfigContextValues;
}

export const withConfig = <P extends Object = {}>(
  WrappedComponent: ComponentType<P & WithConfigProps>,
) =>
  class WithConfigValues extends Component<P & WithConfigProps> {
    render() {
      return (
        <ConfigContext.Consumer>
          {(config) => <WrappedComponent {...this.props} config={config} />}
        </ConfigContext.Consumer>
      );
    }
  };

export const useConfig = () => {
  return {
    ...useContext(ConfigContext),
    createApiUrl,
  };
};
