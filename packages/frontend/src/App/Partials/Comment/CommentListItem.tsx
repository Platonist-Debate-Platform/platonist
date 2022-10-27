import {
  ApplicationKeys,
  Comment,
  CommentStatus,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  RestMethodKeys,
  RolePermissionTypes,
  RoleState,
  User,
} from '@platonist/library';
import { stringify } from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link, match as Match, Redirect } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import { usePermission, useRoles } from '../../Hooks';
import { CommentItem } from './CommentItem';
import { CommentModeration } from './CommentModeration';
import { CommentReplies } from './CommentReplies';
import './CommentItem.scss';
import { GERMAN } from '../../i18n';

export interface CommentListItemProps extends Comment {
  canCreate?: boolean;
  canEdit?: boolean;
  debateId: Debate['id'];
  isDisputed: boolean;
  isDetail: boolean;
  isReply?: boolean;
  match?: Match<{ commentId?: string }>;
  onSubmit?: () => void;
  path: string;
  isModerator?: boolean;
  index?: number;
}

export const CommentListItem: FunctionComponent<CommentListItemProps> = ({
  canCreate,
  canEdit,
  debateId,
  isDetail,
  isReply,
  match,
  onSubmit,
  path,
  isModerator,
  index,
  ...props
}) => {
  const author = props.user as User;
  const history = useHistory();

  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);

  const editQuery =
    '?' +
    stringify({
      edit: 'comment',
      id: props.id,
    });

  const replyQuery = unescape(
    '?' +
      stringify({
        edit: 'reply',
        id: props.id,
      }),
  );

  const moderateQuery = unescape(
    '?' +
      stringify({
        edit: 'moderate',
        id: props.id,
      }),
  );

  const viewReplyQuery = unescape(
    '?' +
      stringify({
        view: 'replies',
        id: props.id,
      }),
  );

  const [canWrite, setCanWrite] = useState<boolean>(
    canEdit && user?.id === author?.id ? true : false,
  );

  const roleState = useRoles(PrivateRequestKeys.Role, user?.id) as RoleState;

  const [canComment] = usePermission({
    id: user?.role?.id,
    methods: [RestMethodKeys.Create, RestMethodKeys.Update],
    permission: RolePermissionTypes.Application,
    state: roleState,
    type: ApplicationKeys.Comment,
  });

  const [canModerate] = usePermission({
    id: user?.role?.id,
    methods: [
      RestMethodKeys.Delete,
      RestMethodKeys.Create,
      RestMethodKeys.Update,
    ],
    permission: RolePermissionTypes.Application,
    state: roleState,
    type: ApplicationKeys.Moderation,
  });

  const isDisputed =
    props.isDisputed ||
    (props.moderation && props.moderation.status === CommentStatus.Disputed)
      ? true
      : false;

  const isBlocked =
    props.moderation && props.moderation.status === CommentStatus.Blocked
      ? true
      : false;

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleSuccess = useCallback(() => {
    if (!shouldRedirect) {
      setShouldRedirect(true);
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit, shouldRedirect]);

  const handleReplies = () => {
    history.push(location.pathname);
    setTimeout(() => {
      history.push(
        isDetail
          ? `${path}/${props.id}`
          : (location.pathname + location.search).indexOf(
              location.pathname + viewReplyQuery,
            ) > -1
          ? location.pathname
          : location.pathname + viewReplyQuery,
      );
    }, 100);
  };

  useEffect(() => {
    if (isReply) {
      return;
    }
    if (canWrite !== (canEdit && user?.id === author?.id)) {
      setCanWrite(!canWrite);
    }

    if (shouldRedirect) {
      setShouldRedirect(false);
    }
  }, [
    author?.id,
    canWrite,
    location.search,
    canEdit,
    editQuery,
    shouldRedirect,
    user?.id,
    isReply,
  ]);

  return (
    <div
      id={props.id}
      className={
        !props.parent ? 'comment-list-item parent' : 'comment-list-item'
      }
    >
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CommentItem
                index={index}
                debateId={debateId}
                editQuery={editQuery}
                handleSuccess={handleSuccess}
                item={props}
                user={user}
                isModerationPanel={isModerator}
              />
              <div className="comment-list-item-settings">
                <Row>
                  <Col>
                    {!props.parent && (
                      <div
                        onClick={handleReplies}
                        className="p-0 mr-3 btn btn-none btn-sm"
                        title="Zeige Antworten"
                      >
                        <Badge>{props.replyCount}</Badge>{' '}
                        {GERMAN.comments.comments}{' '}
                        <i className="fa fa-chevron-right" />
                      </div>
                    )}
                  </Col>
                  <Col className="text-right">
                    {!isDisputed && canComment && !props.parent && (
                      <Link
                        to={
                          (isDetail
                            ? `${path}/${props.id}`
                            : location.pathname) + replyQuery
                        }
                        className="p-0 mr-3 btn btn-none btn-sm"
                      >
                        <i className="fa fa-reply" /> {GERMAN.comments.reply}
                      </Link>
                    )}
                    {!isDisputed &&
                      !isBlocked &&
                      canWrite &&
                      location.search !== editQuery && (
                        <Link
                          to={
                            (isReply
                              ? `${path}/${props.id}`
                              : location.pathname) + editQuery
                          }
                          className="p-0 btn btn-none btn-sm"
                        >
                          <i className="fa fa-edit" /> {GERMAN.comments._edit}
                        </Link>
                      )}
                    {!isModerator && canModerate && (
                      <Link
                        to={
                          isDetail
                            ? `${path}/${props.id}${moderateQuery}`
                            : (location.pathname + location.search).indexOf(
                                location.pathname + moderateQuery,
                              ) > -1
                            ? location.pathname
                            : location.pathname + moderateQuery
                        }
                        className="p-o btn btn-none btn-sm"
                      >
                        <i className="fa fa-cogs" /> {GERMAN.comments.moderate}
                      </Link>
                    )}
                  </Col>
                </Row>
              </div>
              {!isReply && (
                <>
                  {canComment && (
                    <CommentReplies
                      canComment={canComment}
                      from={location.pathname}
                      isDisputed={isDisputed}
                      isDetail={true}
                      isForForm={true}
                      parent={props.id}
                      path={path}
                      to={location.pathname + replyQuery}
                    />
                  )}
                  {canModerate && (
                    <CommentModeration
                      commentId={props.id}
                      from={location.pathname}
                      hasModeration={props.moderation !== null}
                      to={location.pathname + moderateQuery}
                    />
                  )}
                  <CommentReplies
                    canComment={canComment}
                    canEdit={canEdit}
                    from={location.pathname}
                    isDisputed={isDisputed}
                    isDetail={true}
                    match={match}
                    parent={props.id}
                    path={path}
                    to={location.pathname + viewReplyQuery}
                  />
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {shouldRedirect && <Redirect to={location.pathname} />}
    </div>
  );
};
