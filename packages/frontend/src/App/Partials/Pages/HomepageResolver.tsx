import React from 'react';
import { useSelector } from 'react-redux';

import { GlobalState, Homepage } from '@platonist/library';
import { ContentResolver } from '../Content';
import { HomepageSettings } from '../Edit';
import PageMeta from './Meta';

export const HomepageResolver: React.FC<Homepage & { isAdmin: boolean }> = (
  props,
) => {
  const { content, isAdmin, meta, title } = props;

  const user = useSelector((state: GlobalState) => state.user);

  return (
    <>
      <PageMeta homepage={props} title={title} meta={meta} />
      {isAdmin && user?.result && <HomepageSettings user={user.result} />}
      {content && (
        <ContentResolver contents={content} isAdmin={isAdmin} path={'/'} />
      )}
    </>
  );
};

export default HomepageResolver;
