import './Text.scss';
import classNames from 'classnames';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { Text as TextComponentProps } from '@platonist/library';

export const TextComponent: React.FunctionComponent<
  TextComponentProps & { forJobs?: boolean }
> = ({ __component, active, content, forJobs, isFluid }) => {
  if (!active) {
    return null;
  }

  const className = __component.replace(/\./g, '-').toLowerCase();

  return (
    <div className={className}>
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
            <ReactMarkdown
            // components={{
            //   image: ({node, }) => {
            //     return node && node.properties && <>{assetRenderer({src: node.properties.src})}</>
            //   },
            // }}
            >
              {content}
            </ReactMarkdown>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TextComponent;
