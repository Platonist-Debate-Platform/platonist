import React, { useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useUser, useUserComments } from '../../Hooks';
import { Image } from '../Image';
import { Comment, Image as ImageProps } from '@platonist/library';
import TimeAgo from 'react-timeago2';

// @ts-ignore
import germanStrings from 'react-timeago2/lib/language-strings/de';
// @ts-ignore
import buildFormatter from 'react-timeago2/lib/formatters/buildFormatter';

import noImageItem from '../../../Assets/Images/dummy-profile.png';

const formatter = buildFormatter(germanStrings);

const noImage: ImageProps = {
  id: 9999999,
  name: 'a44af3bb5f074e3cdb4be8a56232c996.jpg',
  alternativeText: '',
  caption: '',
  width: 400,
  height: 400,
  ext: '.png',
  hash: '',
  mime: 'image/jpeg',
  url: noImageItem,
  previewUrl: null,
  provider: 'local',
  provider_metadata: null,
  created_at: '2020-12-17T07:46:28.764Z',
  updated_at: '2020-12-17T07:46:28.786Z',
  size: 119,
};

export interface UserProfilePageProps {}

export const UserProfilePage: React.FunctionComponent<
  UserProfilePageProps
> = () => {
  const params = useParams<{ username: string }>();

  const {
    user: { error, result },
    send,
  } = useUser(params.username);

  const { result: comments } = useUserComments(result?.id);
  const list = comments as any as Comment[];

  useEffect(() => {
    send({
      method: 'GET',
      pathname: `/users/${params.username}`,
      get: true,
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <>
        <section className="section section-profile">
          <h2>Profil {params.username} nicht gefunden.</h2>
        </section>
      </>
    );
  }

  if (!params.username) return <Redirect to="/" />;

  return (
    <>
      <section className="section section-profile">
        <Container>
          <Row>
            <Col>
              <h2>{params.username}</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <div className="profile-image">
                {result?.avatarOriginal ? (
                  <Image {...(result?.avatarOriginal as ImageProps)} />
                ) : (
                  <Image {...noImage} isLocal={true} />
                )}
              </div>
            </Col>
            <Col md={8}>
              {/* <div>Bis jetzt noch keine Beiträge.</div> */}
              {/* <div className="d-flex">
                <div
                  className="border border-light rounded bg-light w-75"
                  style={{ height: 30 }}
                ></div>
              </div>
              <div
                className="border border-light rounded bg-light mt-3 d-flex justify-content-center align-items-center"
                style={{ height: 300 }}
              >
                <b>Beiträge des Nutzers kommen beim nächsten Update!</b>
              </div> */}
              {list?.map((comment, id) => {
                return (
                  <Card
                    key={`user_${params.username}_comment_${id}`}
                    className="border rounded border-light bg-light mb-3"
                  >
                    <CardBody>
                      <span style={{ lineHeight: 2 }}>
                        {params.username} kommentierte{' '}
                        <TimeAgo
                          formatter={formatter}
                          date={comment.created_at}
                        />
                      </span>
                      <p>{comment.comment}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
