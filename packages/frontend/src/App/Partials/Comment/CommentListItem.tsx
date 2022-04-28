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
import { useSelector } from 'react-redux';
import { Link, match as Match, Redirect } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import { usePermission, useRoles } from '../../Hooks';
import { CommentItem } from './CommentItem';
import { CommentModeration } from './CommentModeration';
import { CommentReplies } from './CommentReplies';

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
}

/**
 * TODO: this needs to fix. Bug with nested comments
 * @param param0 
 * @returns 
 */
export const CommentListItem: FunctionComponent<CommentListItemProps> = ({
  canCreate,
  canEdit,
  debateId,
  isDetail,
  isReply,
  match,
  onSubmit,
  path,
  ...props
}) => {
  const author = props.user as User;

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
    <div className="comment-list-item">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CommentItem
                debateId={debateId}
                editQuery={editQuery}
                handleSuccess={handleSuccess}
                item={props}
                user={user}
              />
              <div className="comment-list-item-settings">
                <Row>
                  <Col>
                    <Link
                      to={
                        isDetail
                          ? `${path}/${props.id}`
                          : (location.pathname + location.search).indexOf(
                              location.pathname + viewReplyQuery,
                            ) > -1
                          ? location.pathname
                          : location.pathname + viewReplyQuery
                      }
                      className="p-0 mr-3 btn btn-none btn-sm"
                      title="Show replies"
                    >
                      <Badge>{props.replyCount}</Badge> Replies{' '}
                      <i className="fa fa-chevron-right" />
                    </Link>
                  </Col>
                  <Col className="text-right">
                    {!isDisputed && canComment && (
                      <Link
                        to={
                          (isDetail
                            ? `${path}/${props.id}`
                            : location.pathname) + replyQuery
                        }
                        className="p-0 mr-3 btn btn-none btn-sm"
                      >
                        <i className="fa fa-reply" /> Reply
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
                          <i className="fa fa-edit" /> Edit
                        </Link>
                      )}
                    {canModerate && (
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
                        <i className="fa fa-cogs" /> Moderate
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
