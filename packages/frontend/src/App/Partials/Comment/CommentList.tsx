import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { usePrevious, useUnmount } from 'react-use';
import { Col, Container, Row } from 'reactstrap';

import {
  ApplicationKeys,
  Comment,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  QueryParameterBase,
  ReactReduxRequestDispatch,
  RequestStatus,
  RestMethodKeys,
  RolePermissionTypes,
  RoleState,
  useConfig,
} from '@platonist/library';

import {} from '../../../Library';
import {
  useComments,
  useCommentSocket,
  useDebates,
  usePermission,
  useRoles,
} from '../../Hooks';
import { CommentAdd } from './CommentAdd';
import { CommentListItem } from './CommentListItem';
import { ModerationPanel } from '../Content';

export interface CommentListProps {
  debateId: Debate['id'];
  match: Match<{ commentId?: string }>;
  path: string;
}

export const CommentList: FunctionComponent<CommentListProps> = ({
  debateId,
  match,
  path,
}) => {
  const {
    state: { result: debate, status: debateStatus },
  } = useDebates<Debate>({
    key: PublicRequestKeys.Debate,
    id: debateId,
    stateOnly: true,
  });

  const config = useConfig();
  const [comment, meta] = useCommentSocket();
  const prevHash = usePrevious(meta.hash);

  const prevComment = usePrevious(comment);

  const dispatch = useDispatch<ReactReduxRequestDispatch>();

  const user = useSelector<GlobalState, GlobalState[PrivateRequestKeys.User]>(
    (state) => state.user,
  );

  const role = useRoles(
    PrivateRequestKeys.Role,
    user.result?.role?.id,
  ) as RoleState;

  const [canWrite] = usePermission({
    id: user.result?.role?.id,
    methods: [RestMethodKeys.Update, RestMethodKeys.Create],
    permission: RolePermissionTypes.Application,
    type: ApplicationKeys.Comment,
    state: role,
  });

  const query: QueryParameterBase = {
    id: match?.params?.commentId,
    _sort: 'created_at:DESC',
    // _limit: 3,
    // _start: 0,
  };

  Object.assign(
    query,
    !query.id
      ? {
          'debate.id': debateId,
        }
      : {},
  );

  const {
    clear,
    load,
    state: { status, result: comments },
    reload,
  } = useComments<Comment[]>({
    key: PublicRequestKeys.Comments,
    query,
  });

  const handleSubmit = useCallback(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const shouldReload = meta.hash !== prevHash && comment ? true : false;

    if (shouldReload && status === RequestStatus.Loaded) {
      reload();
    }
  }, [
    comment,
    status,
    config.api,
    debate,
    debateId,
    debateStatus,
    dispatch,
    prevComment,
    load,
    meta.hash,
    prevHash,
    reload,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded) {
      clear();
    }
  });

  return (
    <div className="comments-list">
      <Container>
        <CommentAdd debateId={debateId} />
        <Row className="mt-3">
          <Col md={6}>
            <h3>Moderation</h3>
            <ModerationPanel
              comments={comments}
              canEdit={canWrite}
              debateId={debateId}
              isDetail={false}
              match={match}
              onSubmit={handleSubmit}
              path={path}
            />
          </Col>
          <Col md={6} >
            <h3>Kommentare</h3>
            <div
              className="comment-list-root"
            >
            <div style={{
              margin: "1em"
            }}>
            {(comments &&
              comments.length &&
              comments.map((item, index) => {
                  if (!item.moderator) return <CommentListItem
                    canEdit={canWrite}
                    debateId={debateId}
                    isDisputed={item.disputed}
                    isDetail={false}
                    key={`comment_list_item_${item.id}_${index}`}
                    match={match}
                    onSubmit={handleSubmit}
                    path={path}
                    {...item}
                  />
                  return null;
                }
              )) || (
              <>
                {!(
                  status === RequestStatus.Updating ||
                  status === RequestStatus.Initial
                ) && <>No Comments yet!</>}
              </>
            )}
            </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
