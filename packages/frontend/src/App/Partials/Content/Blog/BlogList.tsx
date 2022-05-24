import './BlogList.scss';

import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { usePrevious, useUnmount } from 'react-use';

import {
  Debate,
  DebateList,
  GlobalState,
  PublicRequestKeys,
  QueryParameterBase,
  ReactReduxRequestDispatch,
  RequestStatus,
  RequestWithPager,
  RestMethodKeys,
  ScrollPager,
  withConfig,
  WithConfigProps,
  BlogList
} from '@platonist/library';

import { useDebates, useDebateSocket } from '../../../Hooks';

type BlogListType = BlogList & WithConfigProps;

export interface BlogListProps extends BlogListType {
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: ReactReduxRequestDispatch;
  path: string;
}

export const BlogListBase: React.FunctionComponent<BlogListProps> = ({
  config,
  page,
  path,
  router,
}) => {
  const [query, setQuery] = useState<QueryParameterBase>({
    _sort: 'created_at:DESC',
    _start: 0,
    _limit: 10,
  });

  const {
    clear,
    send,
    state: { result, status },
    reload,
  } = useDebates<RequestWithPager<Debate[]>>({
    key: PublicRequestKeys.Debates,
    query,
  });

  const debates = result && result.value;

  const [debate, meta, clearSocket] = useDebateSocket();

  const prevDebate = usePrevious(debate);
  const prevHash = usePrevious(meta.hash);

  const { location } = router;

  const handleReach = useCallback(
    (q: QueryParameterBase) => {
      const nextStart = q._start || 0;
      const count = result?.count || 0;
      const limit = (q._start || 0) + (q._limit || 0);

      if (
        (result?.next?._start || 0) <= nextStart &&
        count <= limit &&
        status === RequestStatus.Loaded
      ) {
        const newQuery = {
          ...query,
          ...q,
        };
        send({ query: newQuery });
        setQuery(newQuery);
      }
    },
    [query, result?.count, result?.next?._start, send, status],
  );

  useEffect(() => {
    const shouldReload = meta.hash !== prevHash && !isEqual(debate, prevDebate);

    if (shouldReload && status === RequestStatus.Loaded) {
      reload();
      clearSocket();
    }
  }, [
    config,
    debates,
    status,
    page,
    debate,
    reload,
    prevDebate,
    location.pathname,
    prevHash,
    meta.hash,
    meta,
    clear,
    path,
    clearSocket,
    query,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });

  return (
    <>
      <section className="section section-debate section-debate-list">
        {debates && (
          <ScrollPager
            useWindow={true}
            query={{
              ...query,
              ...result?.current,
            }}
            count={result?.count || 0}
            onReach={handleReach}
          >
            {debates &&
              debates.length &&
              debates.map(
                (debate, index) =>
                  (page.result && debate && (
                    // <DebateListItem
                    //   key={`debate_list_item_${debate.id}_${index}`}
                    //   pageTitle={page.result.title}
                    //   {...debate}
                    // />
                    <div>
                        <h3>TITLE</h3>
                    </div>
                  )) ||
                  null,
              )}
          </ScrollPager>
        )}
      </section>
    </>
  );
};

export const BlogListComponent = connect((state: GlobalState) => ({
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(withConfig(BlogListBase));

export default BlogListComponent;
