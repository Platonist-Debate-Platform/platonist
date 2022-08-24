/* eslint-disable @typescript-eslint/no-unused-vars */
import { Blog, WithConfigProps, RequestStatus } from '@platonist/library';
import React, { useEffect } from 'react';
import {
  useLocation,
  RouteComponentProps,
  match as Match,
} from 'react-router-dom';
import { usePrevious, useUnmount } from 'react-use';
import { RequestSendProps, useBlogArticle } from '../../../Hooks';
import { Container, Col, Row } from 'reactstrap';
import { FormattedDate } from 'react-intl';
import { Image } from '../../Image';
import './BlogList.scss';
import ContentResolver from '../ContentResolver';

export interface BlogArticlePageParams {
  slug: string;
}

export interface BlogArticlePageLocationState {
  id: number;
  slug: string;
}

export interface BlogArticlePageProps extends WithConfigProps {
  isAdmin: boolean;
  path: string;
  routeProps: RouteComponentProps;
}

const BlogArticlePage: React.FunctionComponent<BlogArticlePageProps> = (
  props,
) => {
  const { routeProps, isAdmin, path } = props;
  const location = useLocation<BlogArticlePageLocationState>();

  const {
    clear,
    state: { result: blog, status },
    send: request,
  } = useBlogArticle(location.state.id, true);
  const prevRouterProps = usePrevious(routeProps);

  useEffect(() => {
    // const match = routeProps.match as Match<{ title: string }>;
    const requestProps: RequestSendProps<Blog> = {
      pathname: `blog-articles/${location.state.id}`,
      method: 'GET',
    };

    if (status === RequestStatus.Initial) {
      request(requestProps);
    }
    if (
      routeProps.location.pathname !==
        (prevRouterProps && prevRouterProps.location.pathname) &&
      status !== RequestStatus.Initial
    ) {
      request(requestProps);
    }
  }, [
    location.state.id,
    prevRouterProps,
    request,
    routeProps.location.pathname,
    routeProps.match,
    status,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });

  if (blog) {
    return (
      <>
        <div className="jumbotron-fullscreen jumbotron jumbotron-debate jumbotron-fluid">
          <div className="jumbotron-content">
            <Container>
              <div className="jumbotron-inner">
                <Row>
                  <Col md={12}>
                    <small>
                      <FormattedDate
                        value={blog.created_at}
                        day="numeric"
                        month="long"
                        year="numeric"
                      />
                    </small>
                    <h1>{blog.title}</h1>
                    <div className="underline"></div>
                    <h3>{blog.subtitle}</h3>
                    <div className="blog-image">
                      <Image {...blog.articleImage[0]} />
                    </div>
                    <p>{blog.description}</p>
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        </div>
        <section className="blog-detail-page">
          <Container>
            {blog.content && (
              <ContentResolver
                contents={blog.content}
                isAdmin={isAdmin}
                path={path}
              />
            )}
          </Container>
        </section>
      </>
    );
  }

  return null;
};

export default BlogArticlePage;
