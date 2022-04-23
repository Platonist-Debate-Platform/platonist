import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import {
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
} from '@platonist/library';
import { useUserComments } from '../../Hooks';
import {
  ProfileChangeEmailForm,
  ProfileChangePasswordForm,
  ProfileForm,
  ProfileImage,
} from '../Profile';

export const PageProfile: FunctionComponent = () => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  const comments = useUserComments(user?.id);

  useEffect(
    () => () => {
      if (comments.status === RequestStatus.Loaded) {
        dispatch(requestAction.clear(PublicRequestKeys.Comments));
      }
    },
    [comments, dispatch],
  );

  return (
    <section className="section section-profile">
      {user && (
        <Container>
          <Row>
            <Col>
              <h2>Your profile</h2>
              Welcome <b>{user.username}</b>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <ProfileImage />
            </Col>
            <Col md={8}>
              <ProfileForm />
              <ProfileChangePasswordForm />
              <ProfileChangeEmailForm />
            </Col>
          </Row>
        </Container>
      )}
    </section>
  );
};
