import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';

export const usePages = (
  homepageId?: number,
  update: boolean = false,
): GlobalState['pages'] | undefined => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const pages = useSelector<GlobalState, GlobalState['pages']>(
    (state) => state[PublicRequestKeys.Pages],
  );
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = 'pages';
  url.search =
    (homepageId && `?homepage.id=${homepageId}&_sort=ordering`) || '';

  useEffect(() => {
    if (homepageId) {
      if (!update && pages.status === RequestStatus.Initial) {
        dispatch(
          requestAction.load(PublicRequestKeys.Pages, {
            method: 'GET',
            url: url.href,
          }),
        );
      }

      if (update && pages.status === RequestStatus.Loaded) {
        dispatch(
          requestAction.update(PublicRequestKeys.Pages, {
            method: 'GET',
            url: url.href,
          }),
        );
      }
    }
  }, [dispatch, homepageId, pages, update, url.href]);

  return pages;
};
