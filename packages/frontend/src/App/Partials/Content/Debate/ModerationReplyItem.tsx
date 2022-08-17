import { Comment } from '@platonist/library';
import React from 'react';
import { CardSubtitle, Card, CardBody } from 'reactstrap';
import {
  GlobalState,
  PrivateRequestKeys,
  User,
  RoleType,
} from '@platonist/library';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago2';

// @ts-ignore
import germanStrings from 'react-timeago2/lib/language-strings/de';
// @ts-ignore
import buildFormatter from 'react-timeago2/lib/formatters/buildFormatter';
import { GERMAN } from '../../../i18n';
const formatter = buildFormatter(germanStrings);

export interface ModerationReplyItemProps {
  comment: Comment | null;
  mod?: string;
  modReply: Comment;
}

export const ModerationReplyItem: React.FunctionComponent<
  ModerationReplyItemProps
> = (props) => {
  const user = props.comment?.user as User;
  const { result: author } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);
  const modReply = props.modReply;
  const modUser = modReply.user as User;

  if (props.comment !== null) {
    const createdAt = new Date(props.comment?.created_at).toUTCString();
    const updatedAt = new Date(props.comment?.updated_at).toUTCString();

    // const modCreatedAt = new Date(modReply.created_at).toUTCString();
    // const modUpdatedAt = new Date(modReply.updated_at).toUTCString();

    const isMe = modUser.id === author?.id;

    return (
      <>
        <Card className="comment-list-item parent">
          <CardBody>
            <CardSubtitle>
              <small>
                {(modUser as User) && (
                  <>
                    <Link
                      to={`/user/${
                        author?.id === modUser?.id ? 'me' : modUser?.id
                      }`}
                    >
                      {props.mod === author?.id ? (
                        'Du'
                      ) : (
                        <>{modUser.username}</>
                      )}
                    </Link>{' '}
                    <span>
                      {isMe
                        ? GERMAN.comments.me_replied[0]
                        : GERMAN.comments.replied}{' '}
                      <i>
                        <TimeAgo
                          date={modReply.created_at}
                          formatter={formatter}
                        />
                      </i>{' '}
                      {isMe && GERMAN.comments.me_replied[1]}{' '}
                      {/* {modCreatedAt !== modUpdatedAt && (
                        <>
                          and edited this debate{' '}
                          <i>
                            <TimeAgo date={modReply.updated_at} />
                          </i>
                          .
                        </>
                      )}{' '} */}
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
                {(modUser.role?.type as any) === RoleType.Admin && (
                  <div className="moderation-label">{GERMAN.moderation}</div>
                )}
              </small>
              <div className="card-text">
                <p
                  style={{
                    whiteSpace: 'pre-line',
                  }}
                >
                  {modReply.comment}
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
                <p style={{ whiteSpace: 'pre-line' }}>
                  {props.comment.comment}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  return null;
};
