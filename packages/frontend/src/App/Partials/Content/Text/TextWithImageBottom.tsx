import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { TextWithImage as TextWithImageProps } from '@platonist/library';
import { TextImageHorizontal } from './TextImageHorizontal';

export const TextWithImageBottom: React.FC<
  TextWithImageProps & { forJobs?: boolean }
> = ({
  __component,
  content,
  isFluid,
  forJobs,
  media,
  mediaPosition,
  mediaSize,
  showCaption,
}) => {
  const className = __component.replace(/\./g, '-').toLowerCase();

  return (
    <div className={classNames(className, `${className}-bottom`)}>
      <div
        className={classNames({
          container: !forJobs && !isFluid,
          'container-fluid': !forJobs && isFluid,
        })}
      >
        <Row>
          <Col
            md={!forJobs ? 10 : 12}
            className={classNames({ 'offset-md-1': !forJobs })}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </Col>
        </Row>
        {media && (
          <TextImageHorizontal
            mediaSize={mediaSize}
            mediaPosition={mediaPosition}
            showCaption={showCaption}
            media={media}
          />
        )}
      </div>
    </div>
  );
};
