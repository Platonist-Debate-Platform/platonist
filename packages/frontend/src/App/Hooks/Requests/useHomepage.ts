import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
} from '@platonist/library';
import { useConfig } from '../../../Library';

export const useHomepage = (id: number, update: boolean = false) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const homepage = useSelector<GlobalState, GlobalState['homepage']>(
    (state) => state[PublicRequestKeys.Homepage],
  );
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `homepages/${id}`;

  useEffect(() => {
    if (!update && homepage.status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(PublicRequestKeys.Homepage, {
          method: 'GET',
          url: url.href,
        }),
      );
    }

    if (update && homepage.status === RequestStatus.Loaded) {
      dispatch(
        requestAction.update(PublicRequestKeys.Homepage, {
          method: 'GET',
          url: url.href,
        }),
      );
    }
  }, [dispatch, homepage, update, url.href]);

  return homepage;
};

export default useHomepage;
