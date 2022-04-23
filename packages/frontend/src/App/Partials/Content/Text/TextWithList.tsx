import classNames from 'classnames';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Col, Row } from 'reactstrap';

import { TextWithList as TextWithListProps } from '@platonist/library';

export const TextWithList: React.FunctionComponent<
  TextWithListProps & { forJobs?: boolean }
> = ({ __component, active, content, forJobs, id, isFluid, items }) => {
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
            <ReactMarkdown>{content}</ReactMarkdown>
            {items && items.length > 0 && (
              <ul>
                {items.map(
                  (item, index) =>
                    (item && (
                      <li key={`list_item_${id}_${item.id}_${index}`}>
                        {item.content}
                      </li>
                    )) ||
                    null,
                )}
              </ul>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TextWithList;
