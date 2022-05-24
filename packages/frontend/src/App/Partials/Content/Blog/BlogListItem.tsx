import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';
import { Col, Container, Row } from 'reactstrap';
import { Blog, encodeLink } from '@platonist/library';
import { Image } from '../../Image';
import { BlogLink } from '../../../../Library';

export interface BlogDetailItemProps extends Blog {
  pageTitle: string;
}

export const BlogDetailItem: FunctionComponent<BlogDetailItemProps> = ({
  pageTitle,
  ...blog
}) => {
  const { description, created_at, subtitle, title, articleImage, id } = blog;
  const copy: any = {
    ...blog,
  };

  const image = articleImage[0];

  const href = encodeLink(`/${pageTitle}/${blog.title}`);
  console.log(href);
  return (
    <div className="debate-list-item">
      <Container>
        <Row>
          <Col md={12}>
            <small>
              <FormattedDate
                value={created_at}
                day="numeric"
                month="long"
                year="numeric"
              />
            </small>

            <BlogLink blog={copy} to={href}>
              <h4 className="mb-3">
                {title} <br />
                <small>{subtitle}</small>
              </h4>
            </BlogLink>
          </Col>
          <Col md={4}>
            <Image {...image} />
          </Col>
          <Col md={8}>
            {description}
            <BlogLink
              blog={copy}
              to={href}
              className="btn btn-primary float-right"
            >
              Ansehen <i className="fa-solid fa-newspaper" />
            </BlogLink>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
