import React from 'react';
import { useSelector } from 'react-redux';

import {
  ContentKeys,
  GlobalState,
  Jumbotron,
  TextAlign,
} from '@platonist/library';
import { JumbotronComponent } from '../Content';
import MESSAGES from './NotFound.messages';

export const NotFound = () => {
  const { intl } = useSelector((state: GlobalState) => state.locals);

  const NotFoundData: Jumbotron = {
    __component: ContentKeys.Jumbotron,
    teaser: intl.formatMessage(MESSAGES.teaser),
    callToAction: intl.formatMessage(MESSAGES.backHome),
    title: intl.formatMessage(MESSAGES.ooops),
    isFluid: true,
    isFullScreen: true,
    hasShape: false,
    textAlign: TextAlign.Center,
    media: {
      id: 41,
      name: 'milky-way-2675322_1920',
      alternativeText: '',
      caption: '',
      width: 1920,
      height: 1080,
      formats: {
        thumbnail: {
          hash: 'thumbnail_milky_way_2675322_1920_23efa1df31',
          ext: '.jpeg',
          mime: 'image/jpeg',
          width: 245,
          height: 138,
          size: 5.38,
          path: null,
          url: '/uploads/thumbnail_milky_way_2675322_1920_23efa1df31.jpeg',
        },
        large: {
          hash: 'large_milky_way_2675322_1920_23efa1df31',
          ext: '.jpeg',
          mime: 'image/jpeg',
          width: 1000,
          height: 563,
          size: 158.59,
          path: null,
          url: '/uploads/large_milky_way_2675322_1920_23efa1df31.jpeg',
        },
        medium: {
          hash: 'medium_milky_way_2675322_1920_23efa1df31',
          ext: '.jpeg',
          mime: 'image/jpeg',
          width: 750,
          height: 422,
          size: 80.62,
          path: null,
          url: '/uploads/medium_milky_way_2675322_1920_23efa1df31.jpeg',
        },
        small: {
          hash: 'small_milky_way_2675322_1920_23efa1df31',
          ext: '.jpeg',
          mime: 'image/jpeg',
          width: 500,
          height: 281,
          size: 31.43,
          path: null,
          url: '/uploads/small_milky_way_2675322_1920_23efa1df31.jpeg',
        },
      },
      hash: 'milky_way_2675322_1920_23efa1df31',
      ext: '.jpeg',
      mime: 'image/jpeg',
      size: 628.84,
      url: '/uploads/milky_way_2675322_1920_23efa1df31.jpeg',
      previewUrl: null,
      provider: 'local',
      provider_metadata: null,
      created_at: '2020-08-23T09:28:37.000Z',
      updated_at: '2020-08-23T09:28:37.000Z',
    },
    page: {
      active: true,
      contact: null,
      content: null,
      created_at: new Date(),
      id: 99999999,
      inFooter: false,
      inNavigation: false,
      title: '',
      updated_at: new Date(),
      parentPage: null,
    },
  };

  return (
    <>
      <JumbotronComponent className="jumbotron-404" {...NotFoundData} />
    </>
  );
};
