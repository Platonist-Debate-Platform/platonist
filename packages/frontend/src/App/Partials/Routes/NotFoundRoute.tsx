import { GlobalState, PublicRequestKeys } from '@platonist/library';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router';

export const NotFoundRoute: FunctionComponent = () => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  switch (location.pathname) {
    case 'robots.txt':
    case 'sitemap.xml':
      return null;
    default:
      return <Redirect to="/404" />;
  }
};
