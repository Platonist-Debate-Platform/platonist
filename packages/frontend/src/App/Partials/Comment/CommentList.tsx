import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { match as Match } from 'react-router-dom';
import { usePrevious, useUnmount } from 'react-use';
import { Col, Row } from 'reactstrap';

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

  const [sidebarWidth, setSidebarWidth] = useState<number>();
  const [sidebarTop, setSidebarTop] = useState<number>();

  useEffect(() => {
    const sidebarEl = window.document
      .querySelector('.moderation-sidebar')!
      .getBoundingClientRect();
    setSidebarWidth(sidebarEl.width);
    setSidebarTop(sidebarEl.top);

    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sidebarTop) return;

    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarTop, sidebarWidth]);

  const handleResize = () => {
    const sidebarEl = window.document
      .querySelector('.moderation-sidebar')!
      .getBoundingClientRect();
    const columnEl = window.document
      .querySelector('.moderation-column')!
      .getBoundingClientRect();
    setSidebarTop(sidebarEl.top);
    setSidebarWidth(columnEl.width - 30);
  };

  const isSticky = (e: Event) => {
    const sidebarEl = document.querySelector('.moderation-sidebar') as Element;
    const scrollTop = window.scrollY as number;
    if (sidebarTop && scrollTop >= sidebarTop - 100) {
      sidebarEl.classList.add('sticky');
    } else {
      sidebarEl.classList.remove('sticky');
    }
  };

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
      <CommentAdd debateId={debateId} />
      <Row className="mt-3">
        <Col md={4} className="moderation-column">
          <div className="sticky-parent">
            <div className="moderation-sidebar" style={{ width: sidebarWidth }}>
              <h3 className="pl-3 pt-2">Moderation</h3>
              <ModerationPanel
                comments={comments}
                canEdit={canWrite}
                debateId={debateId}
                isDetail={false}
                match={match}
                onSubmit={handleSubmit}
                path={path}
              />
            </div>
          </div>
        </Col>
        <Col md={8}>
          <h3>Kommentare</h3>
          <div className="comment-list-root">
            <div
              style={{
                margin: '1em',
              }}
            >
              {(comments &&
                comments.length &&
                comments.map((item, index) => {
                  if (!item.moderator)
                    return (
                      <CommentListItem
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
                    );
                  return null;
                })) || (
                <>
                  {!(
                    status === RequestStatus.Updating ||
                    status === RequestStatus.Initial
                  ) && <>Keine Kommentare bis jetzt!</>}
                </>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
