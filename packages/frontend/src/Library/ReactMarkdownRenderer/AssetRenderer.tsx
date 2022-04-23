import React from 'react';
import classNames from 'classnames';

import { apiConfig, createApiUrl } from '../Config';
// import { Position } from 'react-markdown';

export interface MarkdownFilRendererNode {
  alt: string;
  // position: Position;
  title?: string;
  type: string;
  url: string;
}

export interface MarkdownFilRendererProps {
  alt: string;
  children: React.ReactNode | React.ReactNodeArray;
  node: MarkdownFilRendererNode;
  src: string;
}

export const getFileExtension = (filename: string) =>
  filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);

export enum ImageFileExtensions {
  JPEG = 'JPEG',
  WebP = 'WebP',
  GIF = 'GIF',
  PNG = 'PNG',
  APNG = 'APNG',
  MNG = 'MNG',
  XBM = 'XBM',
  BMP = 'BMP',
  ICO = 'ICO',
}

export const assetRenderer = (props: MarkdownFilRendererProps): JSX.Element => {
  const api = createApiUrl(apiConfig);
  api.pathname = props.src;

  const fileExtension = getFileExtension(props.src).toUpperCase();

  let isImage = false;

  switch (fileExtension) {
    case ImageFileExtensions.JPEG:
    case ImageFileExtensions.WebP:
    case ImageFileExtensions.GIF:
    case ImageFileExtensions.PNG:
    case ImageFileExtensions.APNG:
    case ImageFileExtensions.MNG:
    case ImageFileExtensions.XBM:
    case ImageFileExtensions.BMP:
    case ImageFileExtensions.ICO:
      isImage = true;
  }

  if (isImage) {
    return <img src={api.href} alt={props.alt} />;
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a
      className={classNames(
        'link',
        'link-download',
        `link-download-${fileExtension}`,
      )}
      rel={fileExtension === 'pdf' ? 'noreferrer' : ''}
      href={api.href}
      title={props.node.title}
      target={fileExtension === 'pdf' ? '_blank' : '_top'}
    >
      <i className="fa fa-file" /> {props.node.title || props.alt}
    </a>
  );
};
