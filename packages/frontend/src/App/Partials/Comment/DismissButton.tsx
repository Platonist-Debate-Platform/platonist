import classNames from 'classnames';
import { encodeLink } from '@platonist/library';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const DismissButton: FunctionComponent<{
  className?: string;
  isBtn: boolean;
  pathname: string;
  title: string;
}> = ({ className, isBtn, pathname, title }) => (
  <Link
    to={encodeLink(pathname)}
    className={classNames('btn', className || '', {
      'btn-none p-0': !isBtn,
      'btn-danger': isBtn,
    })}
    title={title}
  >
    {!isBtn && <i className="fa fa-times" />}
    <span
      className={classNames({
        'sr-only': !isBtn,
      })}
    >
      {title}
    </span>{' '}
    {isBtn && <i className="fa fa-times" />}
  </Link>
);
