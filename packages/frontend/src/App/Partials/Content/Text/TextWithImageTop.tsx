import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { TextWithImage as TextWithImageProps } from '@platonist/library';
import { TextImageHorizontal } from './TextImageHorizontal';

export const TextWithImageTop: React.FC<
  TextWithImageProps & { forJobs?: boolean }
> = ({
  __component,
  content,
  forJobs,
  isFluid,
  media,
  mediaPosition,
  mediaSize,
  showCaption,
}) => {
  const className = __component.replace(/\./g, '-').toLowerCase();

  return (
    <div className={classNames(className, `${className}-top`)}>
      <div
        className={classNames({
          container: !forJobs && !isFluid,
          'container-fluid': !forJobs && isFluid,
        })}
      >
        {media && (
          <TextImageHorizontal
            media={media}
            mediaPosition={mediaPosition}
            mediaSize={mediaSize}
            showCaption={showCaption}
          />
        )}
        <Row>
          <Col
            md={!forJobs ? 10 : 12}
            className={classNames({ 'offset-md-1': !forJobs })}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </Col>
        </Row>
      </div>
    </div>
  );
};
