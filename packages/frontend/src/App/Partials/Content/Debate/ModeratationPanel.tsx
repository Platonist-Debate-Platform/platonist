import React from 'react';
import { useSelector } from 'react-redux';
import {
  GlobalState,
  PublicRequestKeys,
  PrivateRequestKeys,
  Comment,
} from '@platonist/library';
import { CommentForm, CommentListItem } from '../../Comment';
import './ModerationPanel.scss';
import { match as Match } from 'react-router';
import { ModerationReplyItem } from './ModerationReplyItem';
import { ModerationPinnedItem } from './ModerationPinnedItem';

export interface ModerationPanelProps {
  comments?: Comment[];
  canEdit?: boolean;
  debateId?: any;
  isDetail?: boolean;
  match: Match<{ commentId?: string }>;
  onSubmit: () => void;
  path: string;
}

const upliftReplyAsParent = (comment: Comment) => {
  let elements: Comment[] = [];
  if (comment.replies && comment.replies.length > 0) {
    comment.replies.forEach((reply) => {
      if (reply) {
        const ele: Comment = {
          ...reply,
          replies: [comment],
        };
        elements.push(ele);
      }
    });
  }
  return elements;
};

export const ModerationPanel: React.FunctionComponent<ModerationPanelProps> = (
  props,
) => {
  const { comments, debateId, match, onSubmit, path } = props;
  const { result: role } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.Role]
  >((state) => state.role);
  const { result: debate } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Debate]
  >((state) => state.debate);

  if (comments) {
    const pinnedComments = comments?.filter(
      (comment) => comment.moderation?.status === 'pinned',
    );
    const modOnly = comments?.filter((comment) => comment.moderator);
    const repliesWithMod = comments?.filter(
      (comment) =>
        comment.replies &&
        comment.replies?.length > 0 &&
        comment.replies.filter((c) => c?.moderator),
    );

    let arr = [...modOnly, ...pinnedComments];
    repliesWithMod.forEach((ele) => {
      const elements = upliftReplyAsParent(ele);
      arr = [...arr, ...elements];
    });
    const sortedComments = arr.sort((i, j) => {
      if (typeof i.moderation === 'number' || typeof j.moderation === 'number')
        return (
          new Date(j.created_at).getTime() - new Date(i.created_at).getTime()
        );

      if (i.moderation && !j.moderation) {
        return (
          new Date(j.created_at).getTime() -
          new Date(i.moderation.created_at).getTime()
        );
      }
      if (!i.moderation && j.moderation) {
        return (
          new Date(j.moderation.created_at).getTime() -
          new Date(i.created_at).getTime()
        );
      }
      if (i.moderation && j.moderation) {
        return (
          new Date(j.moderation.updated_at).getTime() -
          new Date(i.moderation.updated_at).getTime()
        );
      }
      return (
        new Date(j.created_at).getTime() - new Date(i.created_at).getTime()
      );
    });

    return (
      <>
        <div>
          <div className="moderation-panel-parent">
            <div className="moderation-container">
              {sortedComments.length < 1 && (
                <div style={{ color: 'white' }}>
                  Noch keine Moderationinteraktionen bis jetzt.
                </div>
              )}
              {sortedComments &&
                sortedComments.map((comment, index) => {
                  if (comment.moderation) {
                    return (
                      <ModerationPinnedItem
                        index={index + 1}
                        pinnedComment={comment}
                      />
                    );
                  }
                  if (
                    comment.replies &&
                    comment.replies.length > 0 &&
                    comment.moderator
                  ) {
                    return (
                      <ModerationReplyItem
                        index={index + 1}
                        comment={comment.replies[0]}
                        modReply={comment}
                        mod={comment.moderator}
                        key={`kek-${index}`}
                      />
                    );
                  }
                  if (comment.moderator) {
                    return (
                      <CommentListItem
                        index={index + 1}
                        canEdit={true}
                        debateId={debateId}
                        isDisputed={false}
                        isDetail={false}
                        key={`comment_list_item_${comment.id}_${index}`}
                        match={match}
                        onSubmit={onSubmit}
                        path={path}
                        isModerator
                        {...comment}
                      />
                    );
                  }
                  return null;
                })}
            </div>
          </div>
          {role?.role.type === 'admin' && (
            <div className="moderation-panel-participation">
              {debate && <CommentForm debateId={debate.id} />}
            </div>
          )}
        </div>
      </>
    );
  }

  return null;
};
