import { getCurrentHomepage, RequestStatus } from '@platonist/library';
import { FunctionComponent } from 'react';

import { isDevelopment, SetScrollPosition } from '../Library';
import { useHomepages } from './Hooks';
import { Loader, NotFound } from './Partials';
import LoaderMain from './Partials/Loader/LoaderMain';
import HomepageRoutes from './Partials/Routes/HomepageRoutes';

export const App: FunctionComponent = () => {
  const homepages = useHomepages();
  const location = window.location;
  const homepage =
    homepages.result &&
    getCurrentHomepage(location, homepages.result, isDevelopment);

  if (!homepages) {
    return null;
  }

  switch (homepages.status) {
    case RequestStatus.Loaded:
      return (
        <>
          <Loader />
          <SetScrollPosition>
            {homepage ? <HomepageRoutes {...homepage} /> : <NotFound />}
          </SetScrollPosition>
        </>
      );
    case RequestStatus.Error:
      return <NotFound />;
    case RequestStatus.Initial:
    case RequestStatus.Updating:
    default:
      return <LoaderMain />;
  }
};

export default App;
