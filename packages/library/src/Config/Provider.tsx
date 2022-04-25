import { FunctionComponent, ReactNode, useState } from 'react';

import { AvailableLanguage } from '../Localize';
import { ConfigContext } from './Context';
import { ConfigContextValues } from './Types';

export interface ConfigProviderProps {
  children: ReactNode;
  config: ConfigContextValues;
}

export const ConfigProvider: FunctionComponent<ConfigProviderProps> = ({
  children,
  config,
}) => {
  const [api /* setApi */] = useState(config.api);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApiChange = (code: AvailableLanguage) => {
    //
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        api,
        changeApi: handleApiChange,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
