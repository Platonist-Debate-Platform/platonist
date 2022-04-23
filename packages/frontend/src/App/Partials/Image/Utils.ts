import { Image, ImageFormat, ImageFormats } from '@platonist/library';

export const createSrcSet = (formats: ImageFormats, url: URL): string[] => {
  const formatsArray: ImageFormat[] = Object.keys(formats).map(
    (key: string) => formats[key as keyof Image['formats']],
  );
  return formatsArray
    .sort((a, b) => a.width - b.width)
    .map((format) => {
      return `${url.origin}${format.url}?v=${Date.now()} ${format.width}w`;
    });
};
