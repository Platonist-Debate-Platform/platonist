import {
  ApiConfig,
  ApiProtocol,
  AppEnvKeys,
  Breakpoint,
  BreakpointTypes,
  DefaultConfig,
} from './Types';

// eslint-disable-next-line prefer-destructuring
const env = process.env;
const win = global || window;
const NODE_ENV: AppEnvKeys = (env.REACT_APP_ENV || env.NODE_ENV) as AppEnvKeys;

export const isDevelopment =
  (NODE_ENV as AppEnvKeys) === AppEnvKeys.Development;
export const isProduction = (NODE_ENV as AppEnvKeys) === AppEnvKeys.Production;
export const isStaging = (NODE_ENV as AppEnvKeys) === AppEnvKeys.Staging;
export const isTest = (NODE_ENV as AppEnvKeys) === AppEnvKeys.Test;

export const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(
  win?.location?.hostname,
);

const resolveApiUrl = (environment: AppEnvKeys) => {
  switch (environment) {
    case AppEnvKeys.Production:
      return 'api.globalctgroup.com';
    case AppEnvKeys.Staging:
      return 'staging-api.globalctgroup.com';
    case AppEnvKeys.Test:
      return 'test-api.globalctgroup.com';
    case AppEnvKeys.Development:
    default:
      return 'localhost';
  }
};

export const apiConfig: ApiConfig = {
  protocol: isDevelopment ? ApiProtocol.Http : ApiProtocol.Https,
  url: env.REACT_APP_API || resolveApiUrl(env.REACT_APP_ENV as AppEnvKeys),
  path: '',
  port: isDevelopment ? 1337 : undefined,
};

export const createApiUrl = ({
  path,
  port,
  protocol,
  url,
}: ApiConfig = apiConfig) =>
  new URL(
    path || '',
    `${protocol}://${url}${(port && `:${port}`) || ''}${path && `/${path}`}`,
  );

export const breakpoints: Breakpoint[] = [
  {
    type: BreakpointTypes.Xxs,
    size: 370,
  },
  {
    type: BreakpointTypes.Xs,
    size: 576,
  },
  {
    type: BreakpointTypes.Sm,
    size: 768,
  },
  {
    type: BreakpointTypes.Md,
    size: 992,
  },
  {
    type: BreakpointTypes.Lg,
    size: 1200,
  },
  {
    type: BreakpointTypes.Xl,
    size: 1550,
  },
];

export const defaultConfig = (): DefaultConfig => ({
  api: {
    config: apiConfig,
    createApiUrl,
    url: createApiUrl(apiConfig),
  },
  breakpoints,
  cookieNames: {
    signInRedirect: 'sign-in-redirect',
  },
  env: {
    host: env.REACT_APP_HOST || 'localhost',
    protocol:
      env.REACT_APP_HTTPS === 'true' ? ApiProtocol.Https : ApiProtocol.Http,
    port: (env.REACT_APP_PORT && Number(env.REACT_APP_PORT)) || 3000,
    publicUrl:
      env.REACT_APP_PUBLIC_URL && env.REACT_APP_PUBLIC_URL.length > 0
        ? env.REACT_APP_PUBLIC_URL
        : undefined,
  },
  isDevelopment,
  isLocalhost,
});
