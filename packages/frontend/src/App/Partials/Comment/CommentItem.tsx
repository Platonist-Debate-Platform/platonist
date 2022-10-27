import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { CardSubtitle } from 'reactstrap';
import {
  Comment,
  CommentStatus,
  Debate,
  GlobalState,
  PublicRequestKeys,
  User,
  RoleType,
} from '@platonist/library';
import TimeAgo from 'react-timeago2';
import { useSelector } from 'react-redux';
import { DismissButton } from './DismissButton';
import { CommentForm } from './CommentForm';
import { GERMAN } from '../../i18n';

// @ts-ignore
import germanStrings from 'react-timeago2/lib/language-strings/de';
// @ts-ignore
import buildFormatter from 'react-timeago2/lib/formatters/buildFormatter';
// import { useUser } from '../../Hooks';
const formatter = buildFormatter(germanStrings);

export interface CommentItemProps {
  debateId: Debate['id'];
  editQuery: string;
  handleSuccess: () => void;
  item: Comment;
  user?: User;
  index?: number;
  isModerationPanel?: boolean;
}

export const CommentItem: FunctionComponent<CommentItemProps> = ({
  debateId,
  editQuery,
  handleSuccess,
  item,
  user,
  index,
  isModerationPanel,
}) => {
  const author = item.user as User;
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state[PublicRequestKeys.Router]);
  const createdAt = new Date(item.created_at).toUTCString();
  const updatedAt = new Date(item.updated_at).toUTCString();

  const isMe = user?.id === author?.id ? true : false;

  if (author) {
    return (
      <>
        <CardSubtitle>
          <small>
            {isModerationPanel && <>{index} - </>}
            {author && (
              <Link
                to={`/user/${user?.id === author?.id ? 'me' : author.username}`}
              >
                {isMe ? 'Du' : <>{author.username}</>}
              </Link>
            )}{' '}
            <span>
              {!isMe ? GERMAN.comments.comment : GERMAN.comments.me_comment[0]}{' '}
              <i>
                <TimeAgo date={item.created_at} formatter={formatter} />
              </i>{' '}
              {isMe && GERMAN.comments.me_comment[1]}
              {createdAt !== updatedAt && (
                <>
                  <div className="edit-label">{GERMAN.comments.edit}</div>
                </>
              )}{' '}
            </span>
            {(author.role?.type as any) === RoleType.Admin && (
              <div className="moderation-label">{GERMAN.moderation}</div>
            )}
          </small>
        </CardSubtitle>
        <div className={'card-text'}>
          {(item.moderation &&
            item.moderation.status !== CommentStatus.Active) ||
          location.search !== editQuery ? (
            <>
              <p style={{ whiteSpace: 'pre-line' }}>{item.comment}</p>
              {item.moderation &&
                item.moderation.status === CommentStatus.Disputed && (
                  <p className="small text-danger">
                    {' '}
                    <i className="fa fa-exclamation-triangle" /> Dieser
                    Kommentar wurde von der Moderation blockiert, da er gegen
                    die Debattenrichtlinien verstößt.
                  </p>
                )}
              {item.moderation &&
                item.moderation.status === CommentStatus.Blocked && (
                  <p className="small text-danger">
                    <i className="fa fa-exclamation-triangle" /> Dieser
                    Kommentar wurde von der Moderation blockiert, da er gegen
                    die Debattenrichtlinien verstößt.
                  </p>
                )}
              {item.moderation && item.moderation.reason && (
                <blockquote className="blockquote">
                  <p className="small mb-0">
                    {item.moderation && item.moderation.reason}
                  </p>
                </blockquote>
              )}
            </>
          ) : (
            <>
              {item.moderation === null ||
              item.moderation?.status === CommentStatus.Active ? (
                <>
                  <DismissButton
                    isBtn={false}
                    pathname={location.pathname}
                    title="Cancel"
                  />
                  <CommentForm
                    commentId={item.id}
                    debateId={debateId}
                    defaultData={{ comment: item.comment }}
                    dismissElement={
                      <DismissButton
                        className="btn-sm mr-3"
                        isBtn={true}
                        pathname={location.pathname}
                        title="Cancel"
                      />
                    }
                    onSuccess={handleSuccess}
                    reset={false}
                  />
                </>
              ) : (
                <p className="small text-danger">
                  <i className="fa fa-exclamation-triangle" />
                  Dieser Kommentar wurde von der Moderation blockiert, da er
                  gegen die Debattenrichtlinien verstößt.
                </p>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  return null;
};
