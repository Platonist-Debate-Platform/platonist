import React, { FunctionComponent, useCallback } from 'react';
import { match as Match } from 'react-router-dom';
import { useUnmount } from 'react-use';

import {
  Comment,
  Debate,
  PublicRequestKeys,
  RequestStatus,
} from '@platonist/library';
import { useComments, useDebates } from '../../Hooks';
import { CollapseWithRoute } from '../Collapse';
import { CommentForm } from './CommentForm';
import { CommentListItem } from './CommentListItem';

export interface CommentRepliesProps {
  canComment?: boolean;
  canEdit?: boolean;
  from: string;
  isDisputed: boolean;
  isDetail: boolean;
  isForForm?: boolean;
  match?: Match<{ commentId?: string }>;
  parent: Comment['id'];
  path: string;
  to: string;
}

export const CommentReplies: FunctionComponent<CommentRepliesProps> = ({
  canComment,
  canEdit,
  isDisputed,
  isDetail,
  isForForm,
  match,
  parent,
  path,
  ...props
}) => {
  const {
    state: { result: debate },
  } = useDebates<Debate>({
    key: PublicRequestKeys.Debate,
    stateOnly: true,
  });

  const {
    clear,
    send,
    state: { status, result: comments },
  } = useComments<Comment[]>({
    key: PublicRequestKeys.CommentReplies,
    stateOnly: true,
  });

  const handleEntered = useCallback(() => {
    if (status === RequestStatus.Initial) {
      send({
        method: 'GET',
        pathname: 'comments',
        query: { 'parent.id': parent },
      });
    }
  }, [parent, send, status]);

  const handleExited = useCallback(() => {
    clear();
  }, [clear]);

  useUnmount(() => {
    clear();
  });

  return (
    <CollapseWithRoute
      {...props}
      onExited={handleExited}
      onEntered={handleEntered}
    >
      {isForForm ? (
        <>
          {!isDisputed ? (
            debate && <CommentForm debateId={debate.id} parent={parent} />
          ) : (
            <p className="small text-danger">
              <i className="fa fa-exclamation-triangle"></i>
              This Comment is Disputed, replying is disabled
            </p>
          )}
        </>
      ) : (
        <div className="comment-list-reply mt-3">
          {' '}
          {(debate &&
            comments &&
            comments.length &&
            comments.map((item, index) => (
              <CommentListItem
                canCreate={canComment ? true : false}
                canEdit={canEdit}
                debateId={debate.id}
                isDisputed={isDisputed}
                isDetail={isDetail}
                isReply={item.parent ? true : false}
                key={`comment_list_item_reply_${parent}_${item.id}_${index}`}
                match={match}
                path={path}
                {...item}
              />
            ))) || (
            <>
              {!(
                status === RequestStatus.Updating ||
                status === RequestStatus.Initial
              ) && <>No Comments yet!</>}
            </>
          )}
        </div>
      )}
    </CollapseWithRoute>
  );
};
