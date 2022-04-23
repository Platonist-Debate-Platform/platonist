import React from 'react';
import {
  Image as ImageProps,
  MediaSize,
  MediaPosition,
} from '@platonist/library';
import { Row, Col } from 'reactstrap';
import { Image } from '../../Image';

export interface TextImageHorizontalProps {
  media: (ImageProps | null)[];
  mediaPosition: MediaPosition;
  mediaSize: MediaSize;
  showCaption: boolean;
}

export const TextImageHorizontal: React.FC<TextImageHorizontalProps> = ({
  media,
  mediaPosition,
  mediaSize,
  showCaption,
}) => {
  let col = 10;
  let colClassName = 'offset-md-1';

  switch (mediaSize) {
    case MediaSize.Large:
      col = 12;
      colClassName = '';
      break;
    case MediaSize.Small:
      col = 8;
      colClassName = 'offset-md-2';
      break;
    case MediaSize.Default:
    default:
      break;
  }

  const isGallery = media && media.length > 1 ? true : false;

  return (
    <Row>
      <Col md={col} className={colClassName}>
        {!isGallery && media[0] && (
          <Image
            {...media[0]}
            className={`img-wrap-${mediaPosition}`}
            showCaption={showCaption}
          />
        )}
      </Col>
    </Row>
  );
};
