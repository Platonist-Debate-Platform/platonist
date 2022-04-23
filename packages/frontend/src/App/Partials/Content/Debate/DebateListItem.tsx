import { isEmpty } from 'lodash';
import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';
import { Badge, Col, Container, Row } from 'reactstrap';
import {
  Article,
  Debate,
  encodeLink,
  RestMethodKeys,
} from '@platonist/library';
import { ArticleItem } from '../../Article';
import { DebateSettings } from './Settings';
import { DebateLink } from '../../../../Library';

export interface DebateListItemProps extends Debate {
  pageTitle: string;
}

export const DebateListItem: FunctionComponent<DebateListItemProps> = ({
  pageTitle,
  ...debate
}) => {
  const { articleA, articleB, comments, created_at, subTitle, title } = debate;

  const href = encodeLink(`/${pageTitle}/${debate.title}`);
  return (
    <div className="debate-list-item">
      <Container>
        <Row>
          <Col className="text-right">
            <DebateSettings
              method={RestMethodKeys.Update}
              debateId={debate.id}
            />
            <DebateSettings
              method={RestMethodKeys.Delete}
              debateId={debate.id}
            />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <small>
              <FormattedDate
                value={created_at}
                day="numeric"
                month="long"
                year="numeric"
              />
            </small>
            <h4 className="mb-3">
              <DebateLink debate={debate} to={href}>
                {title} <small>{subTitle}</small>
              </DebateLink>
            </h4>
          </Col>
          <Col className="text-right" md={4}>
            <small>
              Comments <Badge>{comments?.length || 0}</Badge>
            </small>
          </Col>
          <Col md={6}>
            {articleA && !isEmpty(articleA) && (
              <ArticleItem {...(articleA as Article)} />
            )}
          </Col>
          <Col md={6}>
            {articleB && !isEmpty(articleB) && (
              <ArticleItem {...(articleB as Article)} />
            )}
          </Col>
          <Col className="text-right" md={12}>
            <DebateLink className="btn btn-primary" debate={debate} to={href}>
              Debate now <i className="fa fa-comments" />
            </DebateLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
