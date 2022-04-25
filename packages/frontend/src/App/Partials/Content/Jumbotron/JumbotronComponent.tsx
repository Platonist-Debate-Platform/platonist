// import './JumbotronComponent.scss';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Jumbotron, Row } from 'reactstrap';

import {
  BreakpointTypes,
  encodeLink,
  Image as ImageProps,
  Jumbotron as JumbotronProps,
  TextAlign,
  useConfig,
} from '@platonist/library';

import shadeLeft from '../../../../Assets/Images/gct_circle-shape_left.svg';
import shadeRight from '../../../../Assets/Images/gct_circle-shape_right.svg';
import { useWindowSize } from '../../../Hooks';
import { Image } from '../../Image';

export const JumbotronComponentContent: React.FC<JumbotronProps> = ({
  callToAction,
  page,
  teaser,
  textAlign,
  title,
  titleSmall,
}) => (
  <Row>
    {textAlign === TextAlign.Full ? (
      <Col>
        <div className={`jumbotron-teaser jumbotron-teaser-${textAlign}`}>
          <div className={`jumbotron-teaser-text text-${textAlign}`}>
            <Row>
              <Col md={10}>
                <h1>
                  {titleSmall && <small>{titleSmall}</small>}
                  {title}
                </h1>
              </Col>
              <Col className="text-small" md={2}>
                {teaser && <span>{teaser}</span>}
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    ) : (
      <Col
        className={classNames({
          'offset-1 offset-md-2 offset-lg-3 offset-xl-4':
            textAlign === TextAlign.Center,
          'offset-2 offset-md-4 offset-lg-6 offset-xl-8':
            textAlign === TextAlign.Right,
        })}
        sm={10}
        md={8}
        lg={6}
        xl={4}
      >
        <div className="jumbotron-teaser">
          <div className={`jumbotron-teaser-text text-${textAlign}`}>
            <h1>
              {titleSmall && <small>{titleSmall}</small>}
              {title}
            </h1>
            {teaser && <p className="lead">{teaser}</p>}
            {page && (
              <Link
                className="btn btn-ghost btn-sized"
                to={`/${encodeLink(page.title)}`}
              >
                {callToAction || 'Read more'}
              </Link>
            )}
          </div>
        </div>
      </Col>
    )}
  </Row>
);

export const JumbotronComponent: React.FunctionComponent<
  JumbotronProps & { className?: string }
> = (props) => {
  const {
    className,
    disableBackground,
    hasShape,
    textAlign,
    isFluid,
    isFullScreen,
    media,
  } = props;

  const windowInnerSize = useWindowSize();
  const config = useConfig();

  const [height, setHeight] = useState<number>(windowInnerSize.height);
  const [width, setWidth] = useState<number>(windowInnerSize.width);

  const sm = config.breakpoints.find(
    (breakpoint) => breakpoint.type === BreakpointTypes.Sm,
  );

  const getShape = (align: TextAlign) => {
    switch (align) {
      case TextAlign.Left:
        return shadeLeft;
      case TextAlign.Right:
        return shadeRight;
      default:
        return undefined;
    }
  };

  const shape = (hasShape && getShape(textAlign)) || undefined;

  const styles = {
    height: ((sm && sm.size) || 768) > width ? height : undefined,
  };

  useEffect(() => {
    if (windowInnerSize.width !== width) {
      setHeight(windowInnerSize.height);
      setWidth(windowInnerSize.width);
    }
  }, [width, windowInnerSize.height, windowInnerSize.width]);

  return (
    <Jumbotron
      className={classNames(className, {
        'jumbotron-fullscreen': isFullScreen,
        'jumbotron-small': !isFullScreen,
      })}
      fluid={isFluid}
      style={isFullScreen ? styles : undefined}
    >
      <div className="jumbotron-content">
        <Container fluid={isFluid}>
          {isFullScreen ? (
            <div className="jumbotron-inner">
              <JumbotronComponentContent {...props} />
            </div>
          ) : (
            <JumbotronComponentContent {...props} />
          )}
        </Container>
      </div>
      {media && (
        <Image
          className={classNames(`jumbotron-bg`, `jumbotron-bg-${textAlign}`, {
            'no-background': disableBackground,
          })}
          {...(media as ImageProps)}
        />
      )}
      {shape && (
        <div className={`jumbotron-shade jumbotron-shade-${textAlign}`}>
          <img
            className="img-fluid"
            src={shape}
            alt=""
            width={959}
            height={608}
          />
        </div>
      )}
    </Jumbotron>
  );
};

export default JumbotronComponent;
