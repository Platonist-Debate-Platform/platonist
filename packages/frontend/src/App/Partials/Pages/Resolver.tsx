import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  withConfig,
  WithConfigProps,
} from '@platonist/library';
import React from 'react';
import { connect } from 'react-redux';

import { ContentResolver } from '../Content';
import PageMeta from './Meta';

export interface PageResolverProps extends WithConfigProps {
  [PublicRequestKeys.Homepage]: GlobalState[PublicRequestKeys.Homepage];
  [PublicRequestKeys.Page]: GlobalState[PublicRequestKeys.Page];
  [PublicRequestKeys.Router]: GlobalState[PublicRequestKeys.Router];
  dispatch: ReactReduxRequestDispatch;
  isAdmin: boolean;
  pageId: number;
  path: string;
}

export class PageResolverBase extends React.Component<PageResolverProps> {
  componentDidMount() {
    const { config, dispatch, pageId } = this.props;

    const url = config && config.api.createApiUrl(config.api.config);
    if (url) {
      url.pathname = `pages/${pageId}`;
      dispatch(
        requestAction.load(PublicRequestKeys.Page, {
          url: url.href,
        }),
      );
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(requestAction.clear(PublicRequestKeys.Page));
  }

  render() {
    const { isAdmin, homepage, page, path } = this.props;

    return (
      <>
        {page.result && homepage.result && (
          <>
            <PageMeta
              homepage={homepage.result}
              title={page.result.title}
              path={path}
            />
            <ContentResolver
              contents={page.result.content}
              isAdmin={isAdmin}
              path={path}
            />
          </>
        )}
      </>
    );
  }
}

export const PageResolver = connect((state: GlobalState) => ({
  [PublicRequestKeys.Homepage]: state[PublicRequestKeys.Homepage],
  [PublicRequestKeys.Page]: state[PublicRequestKeys.Page],
  [PublicRequestKeys.Router]: state[PublicRequestKeys.Router],
}))(withConfig(PageResolverBase));

export default PageResolver;
