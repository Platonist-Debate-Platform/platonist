import classNames from 'classnames';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { TextWithImage as TextWithImageProps } from '@platonist/library';
import { TextImage } from './TextImage';

export const TextWithImageLeft: React.FC<
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
            <Row>
              <Col md={5}>
                {media && (
                  <TextImage
                    mediaSize={mediaSize}
                    mediaPosition={mediaPosition}
                    showCaption={showCaption}
                    media={media}
                  />
                )}
              </Col>
              <Col md={7}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};
