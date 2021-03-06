import './Assets/Sass/index.scss';
import './Library/Fonts/amplesoft';
import './Library/Fonts/icons';
import '@fortawesome/fontawesome-free/css/all.css';
import 'emoji-mart/css/emoji-mart.css';
import 'core-js/es/map';
import 'core-js/es/object/assign';
import 'core-js/es/object/set-prototype-of';
import 'core-js/es/object/values';
import 'core-js/es/set';
import 'raf/polyfill';

import {
  ConnectedRouter as ConnectedRouterBase,
  ConnectedRouterProps,
} from 'connected-react-router';
import { FunctionComponent } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { connect, Provider } from 'react-redux';

import {
  AvailableLanguage,
  ConfigProvider,
  defaultConfig,
  GlobalState,
  isProduction,
  isStaging,
  isTest,
} from '@platonist/library';

import App from './App/App';
import { Alerts } from './Library/Alerts';
import { configureStore, history } from './Library/Redux/Store';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const store = configureStore();

const AppWithTranslationWithoutState: FunctionComponent<{
  locals: AvailableLanguage;
}> = ({ locals }) => (
  <IntlProvider {...locals.intl}>
    <App />
    <Alerts />
  </IntlProvider>
);

const AppWithTranslation = connect((state: GlobalState) => ({
  locals: state.locals,
}))(AppWithTranslationWithoutState);

const ConnectedRouterStub = ConnectedRouterBase as any;

const ConnectedRouter: React.FC<
  React.PropsWithChildren<ConnectedRouterProps>
> = (props) => <ConnectedRouterStub {...props} />;

const AppWithState: FunctionComponent = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppWithTranslation />
    </ConnectedRouter>
  </Provider>
);

export const BaseApp: FunctionComponent = () => (
  <ConfigProvider config={defaultConfig()}>
    <AppWithState />
  </ConfigProvider>
);

if (!isTest) {
  const container = document.getElementById('root');

  if (container) {
    const root = createRoot(container);
    root.render(<BaseApp />);
  }

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://cra.link/PWA
  if (isProduction || isStaging) {
    serviceWorkerRegistration.register();
  } else {
    serviceWorkerRegistration.unregister();
  }

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
