import React, { FunctionComponent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, LinkProps } from 'react-router-dom';

import {
  setDebateLink,
  GlobalState,
  PublicRequestKeys,
  Debate,
  Blog,
  setBlogLink,
} from '@platonist/library';

export interface BlogLinkProps extends LinkProps {
    blog: Blog;
}

export const BlogLink: FunctionComponent<BlogLinkProps> = ({
  children,
  blog,
  to,
  onClick,
  ...rest
}) => {
  const blogLinkState = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.BlogLink]
  >((state) => state[PublicRequestKeys.BlogLink]);

  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (!blogLinkState.id && !blogLinkState.blog && to) {
      dispatch(setBlogLink(blog));
    }
  }, [blog, blogLinkState.blog, blogLinkState.id, dispatch, to]);

  return (
    <Link  {...rest} to={{
        pathname: to.toString() || '',
        state: {
            id: blog.id,
            slug: blog.title,
        }
    }} onClick={handleClick}>
      {children}
    </Link>
  );
};
