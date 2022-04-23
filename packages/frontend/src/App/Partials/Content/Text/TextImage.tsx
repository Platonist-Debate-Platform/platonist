import React from 'react';

import {
  Image as ImageProps,
  MediaPosition,
  MediaSize,
} from '@platonist/library';
import { Image } from '../../Image';

export interface TextImageProps {
  media: (ImageProps | null)[];
  mediaPosition: MediaPosition;
  mediaSize: MediaSize;
  showCaption: boolean;
}

export const TextImage: React.FC<TextImageProps> = ({
  media,
  mediaPosition,
  showCaption,
}) => {
  const isGallery = media && media.length > 1 ? true : false;

  return (
    <>
      {!isGallery && media[0] && (
        <Image
          {...media[0]}
          className={`img-wrap-${mediaPosition}`}
          showCaption={showCaption}
        />
      )}
    </>
  );
};
