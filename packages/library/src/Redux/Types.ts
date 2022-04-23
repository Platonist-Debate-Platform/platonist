import { AxiosRequestConfig } from 'axios';
import { RouterActionType } from 'connected-react-router';
import { Location } from 'history';

import { AlertState } from '../Alerts';
import { DebateLinkState } from '../DebateLink';
import { AvailableLanguage } from '../Localize';
import {
  ArticlesState,
  ArticleState,
  AuthenticationState,
  CommentsState,
  CommentState,
  DebatesState,
  DebateState,
  FileState,
  HomepagesState,
  HomepageState,
  ModerationsState,
  ModerationState,
  PagesState,
  PageState,
  RolesState,
  RoleState,
  UserState,
} from '../Models';
import { PermissionsState, PermissionState } from '../Models/Permission';
import { ReactReduxRequestState } from '../ReactReduxRequest';
import { PrivateRequestKeys, PublicRequestKeys } from './Keys';

export type LocationState<Q extends Object | undefined> = Location & {
  query: Q;
};

export interface RouterState {
  location: Location;
  action: RouterActionType;
}

export interface PublicState {
  [PublicRequestKeys.Alerts]: AlertState;
  [PublicRequestKeys.Authentication]: AuthenticationState;
  [PublicRequestKeys.CommentReplies]: CommentsState;
  [PublicRequestKeys.Comments]: CommentsState;
  [PublicRequestKeys.Debate]: DebateState;
  [PublicRequestKeys.DebateLink]: DebateLinkState;
  [PublicRequestKeys.Debates]: DebatesState;
  [PublicRequestKeys.Homepage]: HomepageState;
  [PublicRequestKeys.Homepages]: HomepagesState;
  [PublicRequestKeys.Moderation]: ModerationState;
  [PublicRequestKeys.Moderations]: ModerationsState;
  [PublicRequestKeys.Locals]: AvailableLanguage;
  [PublicRequestKeys.Page]: PageState;
  [PublicRequestKeys.Pages]: PagesState;
  [PublicRequestKeys.Router]: RouterState;
}

export interface PrivateState {
  [PrivateRequestKeys.Article]: ArticleState;
  [PrivateRequestKeys.Articles]: ArticlesState;
  [PrivateRequestKeys.Comment]: CommentState;
  [PrivateRequestKeys.Moderate]: CommentState;
  [PrivateRequestKeys.File]: FileState;
  [PrivateRequestKeys.Permission]: PermissionState;
  [PrivateRequestKeys.Permissions]: PermissionsState;
  [PrivateRequestKeys.Role]: RoleState;
  [PrivateRequestKeys.Roles]: RolesState;
  [PrivateRequestKeys.Upload]: ReactReduxRequestState<any, AxiosRequestConfig>;
  [PrivateRequestKeys.User]: UserState;
}

export type GlobalState = PublicState & PrivateState;

export interface Dispatch<Action> {
  <A extends Action>(action: A): A;
}

export interface StandardAction<
  ActionType extends string,
  Payload,
  Meta extends undefined | Object,
> {
  type: ActionType;
  meta?: Meta;
  payload: Payload;
}

export type StandardActionFn<
  ActionType extends string,
  Payload extends undefined | Object,
  Meta extends undefined | Object,
> = (props: Payload) => StandardAction<ActionType, Payload, Meta>;
