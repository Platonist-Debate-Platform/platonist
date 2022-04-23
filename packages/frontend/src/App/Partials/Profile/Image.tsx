import './Image.scss';

import { stringify } from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  encodeLink,
  GlobalState,
  Image as ImageProps,
  PrivateRequestKeys,
  PublicRequestKeys,
} from '@platonist/library';
import { Image } from '../Image';
import { ProfileImageEdit } from './ImageEdit';

const noImageItem = require('../../../Assets/Images/dummy-profile.png');

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
  url: noImageItem.default,
  previewUrl: null,
  provider: 'local',
  provider_metadata: null,
  created_at: '2020-12-17T07:46:28.764Z',
  updated_at: '2020-12-17T07:46:28.786Z',
  size: 119,
};

export const ProfileImage: FunctionComponent = () => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const { result: user, status } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  const [avatar, setAvatar] = useState(user?.avatar);

  const queryParameter =
    '?' +
    stringify({
      modal: 'image',
    });

  const target = `${location.pathname}${queryParameter}`;

  const handleFinished = useCallback(() => {
    setAvatar(undefined);
  }, []);

  useEffect(() => {
    if (!avatar && user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [avatar, status, user]);

  return (
    <div className="profile-image">
      <Link to={encodeLink(target)}>
        {avatar ? <Image {...avatar} /> : <Image {...noImage} isLocal={true} />}
      </Link>
      <ProfileImageEdit
        from={location.pathname}
        image={user?.avatarOriginal}
        imageCropped={avatar}
        onFinished={handleFinished}
        to={target}
      />
    </div>
  );
};
