import { Comment } from '@platonist/library';
import React from 'react';
import { CardSubtitle, Card, CardBody } from 'reactstrap';
import {
  Article,
  clearDebateLink,
  Debate,
  DebateLinkDispatch,
  DebateList,
  decodeLink,
  encodeLink,
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  RequestStatus,
  withConfig,
  WithConfigProps,
  PrivateRequestKeys,
  User,
} from '@platonist/library';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago2';
import { useComment, useUser, useUserComments } from '../../../Hooks';

export interface ModerationReplyItemProps {
  comment: Comment;
  mod: string;
}

export const ModerationReplyItem: React.FunctionComponent<
  ModerationReplyItemProps
> = (props) => {
  const user = props.comment.user as User;
  const { result: author } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);
  let { result: userComments }: any = useUserComments(props.mod);
  const moderator: User = userComments[0].user;

  const reducedComments: Comment[] = userComments
    ?.filter((c: Comment) => {
      let belongsToAuthor = false;
      const { replies } = c;
      replies?.forEach((replyComment, replyIndex) => {
        if (replyComment?.moderator === props.mod) {
          belongsToAuthor = true;
          return;
        }
      });
      return belongsToAuthor;
    })
    .map((c: Comment) => {
      const { replies } = c;
      for (const e of replies as Comment[]) {
        if (e.moderator) {
          return e;
        }
      }
      return undefined;
    });

  const reducedRepliedComment: Comment = reducedComments.filter(
    (c: Comment) => {
      if (c.parent === props.comment.id) {
        return true;
      }
      return false;
    },
  )[0];

  if (reducedRepliedComment) {
    userComments = undefined;
  }

  const createdAt = new Date(props.comment.created_at).toUTCString();
  const updatedAt = new Date(props.comment.updated_at).toUTCString();

  const modCreatedAt = new Date(reducedRepliedComment.created_at).toUTCString();
  const modUpdatedAt = new Date(reducedRepliedComment.updated_at).toUTCString();

  return (
    <>
      <Card className="comment-list-item parent">
        <CardBody>
          <CardSubtitle>
            <small>
              {(author as User) && (
                <>
                  <Link
                    to={`/user/${props.mod === moderator?.id ? 'me' : moderator?.id}`}
                  >
                    { props.mod === author?.id ? 'You' : <>{moderator.username}</>}
                  </Link>{' '}
                  <span>
                    replied{' '}
                    <i>
                      <TimeAgo date={reducedRepliedComment.created_at} />
                    </i>{' '}
                    {modCreatedAt !== modUpdatedAt && (
                      <>
                        and edited this debate{' '}
                        <i>
                          <TimeAgo date={reducedRepliedComment.updated_at} />
                        </i>
                        .
                      </>
                    )}{' '}
                  </span>
                  <i
                    className="fa-solid fa-reply"
                    style={{
                      textAlign: 'right',
                      marginLeft: '10px',
                    }}
                  ></i>
                </>
              )}
            </small>
            <div className="card-text">
              <p
                style={{
                  whiteSpace: 'pre-line',
                }}
              >
                {reducedRepliedComment.comment}
              </p>
            </div>
          </CardSubtitle>
          <div className="moderation-debate-reply">
            <small>
              {(user as User) && (
                <>
                  <Link
                    to={`/user/${user?.id === author?.id ? 'me' : user?.id}`}
                  >
                    {user?.id === author?.id ? 'You' : <>{user?.username}</>}
                  </Link>{' '}
                  <span>
                    commented{' '}
                    <i>
                      <TimeAgo date={props.comment.created_at} />
                    </i>{' '}
                    {createdAt !== updatedAt && (
                      <>
                        and edited this debate{' '}
                        <i>
                          <TimeAgo date={props.comment.updated_at} />
                        </i>
                        .
                      </>
                    )}{' '}
                  </span>
                </>
              )}
            </small>
            <div>
              <p style={{ whiteSpace: 'pre-line' }}>{props.comment.comment}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
