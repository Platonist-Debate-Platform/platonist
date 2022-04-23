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

export const useHomepages = (update: boolean = false) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const homepages = useSelector<GlobalState, GlobalState['homepages']>(
    (state) => state[PublicRequestKeys.Homepages],
  );
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = 'homepages';

  useEffect(() => {
    if (!update && homepages.status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(PublicRequestKeys.Homepages, {
          method: 'GET',
          url: url.href,
        }),
      );
    }

    if (update && homepages.status === RequestStatus.Loaded) {
      dispatch(
        requestAction.update(PublicRequestKeys.Homepages, {
          method: 'GET',
          url: url.href,
        }),
      );
    }
  }, [dispatch, homepages, update, url.href]);

  return homepages;
};

export default useHomepages;
