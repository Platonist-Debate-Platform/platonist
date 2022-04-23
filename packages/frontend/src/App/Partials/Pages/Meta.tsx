import React from 'react';
import { Helmet } from 'react-helmet';

import { Homepage, Meta } from '@platonist/library';
import { ApiProtocol, isDevelopment, useConfig } from '../../../Library';

export interface PageMetaProps {
  homepage: Homepage;
  meta?: (Meta | null)[] | null;
  title: string;
  path?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({
  homepage,
  meta,
  path,
  title,
}) => {
  const config = useConfig();
  const isLocal =
    isDevelopment && window.location.hostname === ('localhost' || '127.0.0.1')
      ? true
      : false;

  const baseUrl = isLocal
    ? config.createApiUrl({
        url: config.env.host,
        port: config.env.port,
        protocol: config.env.protocol,
        path: path || '',
      })
    : config.createApiUrl({
        url: homepage.url,
        port: undefined,
        protocol: ApiProtocol.Https,
        path: path || '',
      });

  const isHome = baseUrl.pathname === ('/' || '') ? true : false;

  const metaData: JSX.IntrinsicElements['meta'][] =
    (meta &&
      meta.length > 0 &&
      meta.map((item) => ({
        name: item?.name,
        content: item?.content,
      }))) ||
    [];

  if (homepage.admin) {
    metaData.push({
      name: 'author',
      content: `${homepage.admin.firstName} ${homepage.admin.lastName}`,
    });
  }

  const dynamicTitle = isHome ? homepage.title : `${homepage.title} | ${title}`;

  return (
    <Helmet meta={metaData}>
      <base href={baseUrl.href} />
      <title>{dynamicTitle}</title>
    </Helmet>
  );
};

export default PageMeta;
