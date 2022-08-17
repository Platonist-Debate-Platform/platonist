/* eslint-disable no-shadow */

import { TextWithImage, Text, TextWithList } from './Text';
import { Jumbotron } from './Jumbotron';
import { Tab } from './Tab';
import { Teaser } from './Teaser';
import { Debate } from './Debate';

export enum ContentKeys {
  DebateList = 'debates.debate-list',
  Jumbotron = 'page-content.jumbotron',
  Tab = 'page-content.tab',
  Teaser = 'page-content.teaser',
  Text = 'page-content.text',
  TextWithImage = 'page-content.text-with-image',
  TextWithList = 'page-content.text-with-list',
  TextWithListItem = 'page-content.text-with-list-item',
  CompanyLocationsListItem = 'page-content.company-location-list',
  BlogList = 'blog.blog-list',
}

export type HomepageContent =
  | Jumbotron
  | Tab
  | Teaser
  | Text
  | TextWithImage
  | TextWithList;

export type PageContent = Debate;

export type Content = HomepageContent & PageContent;
