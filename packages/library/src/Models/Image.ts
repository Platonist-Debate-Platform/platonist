/* eslint-disable no-shadow */

export interface ImageFormat {
  ext: string;
  hash: string;
  height: number;
  mime: string;
  path: string | null;
  size: number;
  url: string;
  width: number;
}

export interface ImageFormats {
  large: ImageFormat;
  medium: ImageFormat;
  small: ImageFormat;
  thumbnail: ImageFormat;
}

export interface Image {
  alternativeText: string;
  caption: string;
  created_at: string;
  ext: string;
  formats?: ImageFormats;
  hash: string;
  height: number;
  id: number;
  mime: string;
  name: string;
  previewUrl: string | null;
  provider_metadata: string | null;
  provider: string;
  size: number;
  updated_at: string;
  url: string;
  width: number;
}

export enum MediaPosition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}
export enum MediaSize {
  Small = 'small',
  Default = 'default',
  Large = 'large',
}
