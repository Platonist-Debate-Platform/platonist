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

export const usePage = (
  pageId?: number,
  update: boolean = false,
): GlobalState['page'] | undefined => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const page = useSelector<GlobalState, GlobalState['page']>(
    (state) => state[PublicRequestKeys.Page],
  );
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `pages/${pageId}`;

  useEffect(() => {
    if (pageId) {
      if (!update && page.status === RequestStatus.Initial) {
        dispatch(
          requestAction.load(PublicRequestKeys.Page, {
            method: 'GET',
            url: url.href,
          }),
        );
      }

      if (update && page.status === RequestStatus.Loaded) {
        dispatch(
          requestAction.update(PublicRequestKeys.Page, {
            method: 'GET',
            url: url.href,
          }),
        );
      }
    }
  }, [dispatch, pageId, page, update, url.href]);

  return page;
};
