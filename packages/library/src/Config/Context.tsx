import { createContext } from 'react';
import { ConfigContextValues } from './Types';
import { defaultConfig } from './DefaultConfig';

export const ConfigContext = createContext<ConfigContextValues>(defaultConfig());