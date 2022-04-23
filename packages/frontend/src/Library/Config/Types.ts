import { AvailableLanguage } from '@platonist/library';

export interface DefaultConfigEnv {
  host: string;
  protocol: ApiProtocol;
  port: number;
  publicUrl: string | undefined;
}

export interface DefaultConfigApi {
  config: ApiConfig;
  createApiUrl: (props: ApiConfig) => URL;
  url: URL;
}
export interface DefaultConfig {
  changeApi?: (code: AvailableLanguage) => void;
  api: DefaultConfigApi;
  breakpoints: Breakpoint[];
  cookieNames: {
    signInRedirect: string;
  };
  env: DefaultConfigEnv;
  isDevelopment: boolean;
  isLocalhost: boolean;
}

export interface ConfigContextValues extends DefaultConfig {}

export enum AppEnvKeys {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

export enum ApiProtocol {
  Http = 'http',
  Https = 'https',
}

export interface ApiConfig {
  path?: string;
  port?: number;
  protocol: ApiProtocol;
  url: string;
}

export enum BreakpointTypes {
  Lg = 'lg',
  Md = 'md',
  Sm = 'sm',
  Xl = 'xl',
  Xs = 'xs',
  Xxs = 'xxs',
}
export interface Breakpoint {
  type: BreakpointTypes;
  size: number;
}
