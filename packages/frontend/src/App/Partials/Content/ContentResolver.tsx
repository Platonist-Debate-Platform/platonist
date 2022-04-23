import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  Content,
  ContentKeys,
  DebateList as DebateListProps,
  encodeLink,
  Jumbotron,
  Tab as TabProps,
  Teaser as TeaserProps,
  Text,
  TextWithImage as TextWithImageProps,
  TextWithList as TextWithListProps,
} from '@platonist/library';
import { DebateRoute } from './Debate';
import { JumbotronComponent } from './Jumbotron';
import { TabPage } from './Tab';
import { Teaser } from './Teaser';
import { TextComponent, TextWithImage, TextWithList } from './Text';

export interface ContentResolverProps {
  contents: (Content | null)[] | null;
  isAdmin: boolean;
  path: string;
  routeProps?: RouteComponentProps;
}

export interface ContentResolverItemExtendedProps {
  isAdmin: boolean;
  path: string;
}

export interface ContentResolverItemDefaultProps
  extends ContentResolverItemExtendedProps {
  routeProps?: RouteComponentProps;
}

export type ContentResolverItemProps = Content &
  ContentResolverItemDefaultProps;

export const ContentResolverItem: React.FC<ContentResolverItemProps> = (
  props,
) => {
  const { __component } = props;

  switch (__component) {
    case ContentKeys.DebateList:
      return (
        <DebateRoute
          {...(props as DebateListProps & ContentResolverItemExtendedProps)}
        />
      );

    case ContentKeys.Jumbotron:
      return <JumbotronComponent {...(props as Jumbotron)} />;

    case ContentKeys.Tab:
      return <TabPage {...(props as TabProps)} />;

    case ContentKeys.Teaser:
      return (
        <Teaser {...(props as TeaserProps & ContentResolverItemDefaultProps)} />
      );

    case ContentKeys.Text:
      return <TextComponent {...(props as Text)} />;

    case ContentKeys.TextWithImage:
      return <TextWithImage {...(props as TextWithImageProps)} />;

    case ContentKeys.TextWithList:
      return <TextWithList {...(props as TextWithListProps)} />;

    default:
      return null;
  }
};

export const ContentResolver: React.FC<ContentResolverProps> = ({
  contents,
  isAdmin,
  path,
  routeProps,
}) => {
  return (
    <>
      {contents && contents.length > 0
        ? contents.map((content, index) => (
            <React.Fragment
              key={`content_item_${content?.__component}_${index}`}
            >
              {content && (
                <ContentResolverItem
                  {...content}
                  isAdmin={isAdmin}
                  path={encodeLink(path)}
                  routeProps={routeProps}
                />
              )}
            </React.Fragment>
          ))
        : null}
    </>
  );
};

export default ContentResolver;
