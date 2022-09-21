import React, { useEffect } from 'react';
import { Redirect, useParams } from 'react-router';
import { Container, Row, Col } from 'reactstrap';
import { useUser } from '../../Hooks';
import { Image } from '../Image';
import { Image as ImageProps } from '@platonist/library';

import noImageItem from '../../../Assets/Images/dummy-profile.png';

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

  useEffect(() => {
    send({
      method: 'GET',
      pathname: `/users/${params.username}`,
    });
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
              <div>Bis jetzt noch keine Beiträge.</div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
