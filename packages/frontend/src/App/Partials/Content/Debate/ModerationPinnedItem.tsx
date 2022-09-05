import { Comment, RoleType } from '@platonist/library';
import React from 'react';
import './ModerationPanel.scss';
import { Card, CardBody, CardSubtitle } from 'reactstrap';
import { GlobalState, PrivateRequestKeys, User } from '@platonist/library';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago2';

// @ts-ignore
import germanStrings from 'react-timeago2/lib/language-strings/de';
// @ts-ignore
import buildFormatter from 'react-timeago2/lib/formatters/buildFormatter';
import { GERMAN } from '../../../i18n';
const formatter = buildFormatter(germanStrings);

export interface ModerationPinnedItemProps {
  pinnedComment: Comment;
}

export const ModerationPinnedItem: React.FunctionComponent<
  ModerationPinnedItemProps
> = (props) => {
  const { pinnedComment } = props;
  const author = pinnedComment.moderation?.user as User;
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  if (typeof pinnedComment.moderation === 'number') return null;

  if (pinnedComment.moderation) {
    // const createdAt = new Date(pinnedComment.created_at);
    // const updatedAt = new Date(pinnedComment.updated_at);
    // const modCreatedAt = new Date(pinnedComment.moderation.created_at);
    // const modUpdatedAt = new Date(pinnedComment.moderation.updated_at);

    // TODO: fix here with rendering
    if (user) {
      // eslint-disable-next-line eqeqeq
      const isMe = user?.id == pinnedComment.moderation.moderator;
      return (
        <>
          <Card className="comment-list-item parent">
            <CardBody>
              <CardSubtitle>
                <small>
                  {(user as User) && (
                    <>
                      <i
                        className="fa fa-exclamation-triangle text-danger"
                        style={{ marginRight: '3px' }}
                      ></i>
                      <Link
                        to={`/user/${
                          // eslint-disable-next-line eqeqeq
                          pinnedComment.moderation.moderator == user?.id
                            ? 'me'
                            : (pinnedComment.moderation.user as User).username
                        }`}
                      >
                        {
                          /* eslint-disable-next-line eqeqeq */
                          pinnedComment.moderation?.moderator == user?.id ? (
                            'Du'
                          ) : (
                            <>{pinnedComment.moderation?.user.username}</>
                          )
                        }
                      </Link>{' '}
                      <span>
                        {isMe
                          ? GERMAN.comments.me_pinned[0]
                          : GERMAN.comments.pinned}{' '}
                        <i>
                          <TimeAgo
                            date={pinnedComment.moderation?.updated_at}
                            formatter={formatter}
                          />
                        </i>{' '}
                        {isMe && GERMAN.comments.me_pinned[1]}{' '}
                      </span>
                      <i
                        className="fa-solid fa-map-pin"
                        style={{
                          textAlign: 'right',
                          marginLeft: '10px',
                        }}
                      ></i>
                    </>
                  )}
                  {(author.role?.type as any) === RoleType.Admin && (
                    <div className="moderation-label">{GERMAN.moderation}</div>
                  )}
                </small>
              </CardSubtitle>
              {pinnedComment.moderation.reason ? (
                <div className="card-text">
                  <p
                    style={{
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {pinnedComment.moderation.reason as string}
                  </p>
                </div>
              ) : (
                <div className="card-text">
                  <p
                    style={{
                      whiteSpace: 'pre-line',
                    }}
                  >
                    -
                  </p>
                </div>
              )}
              <div className="moderation-debate-reply">
                <small>
                  <>
                    <Link
                      to={`/user/${
                        user?.id === (pinnedComment.user as User).id
                          ? 'me'
                          : (pinnedComment?.user as User).username
                      }`}
                    >
                      {user?.id === (pinnedComment.user as User).id ? (
                        'You'
                      ) : (
                        <>{(pinnedComment?.user as User).username}</>
                      )}
                    </Link>{' '}
                    <span>
                      kommentierte{' '}
                      <i>
                        <TimeAgo date={pinnedComment.created_at} />
                      </i>{' '}
                    </span>
                  </>
                </small>
                <p
                  style={{
                    whiteSpace: 'pre-line',
                  }}
                >
                  {pinnedComment.comment}
                </p>
              </div>
            </CardBody>
          </Card>
        </>
      );
    }
    return (
      <>
        <Card className="comment-list-item parent">
          <CardBody>
            <CardSubtitle>
              <small>
                {
                  <>
                    <i
                      className="fa fa-exclamation-triangle text-danger"
                      style={{ marginRight: '3px' }}
                    ></i>
                    <Link
                      to={`/user/${(pinnedComment.moderation.user as User).id}`}
                    >
                      <>{pinnedComment.moderation?.user.username}</>
                    </Link>{' '}
                    <span>
                      {GERMAN.comments.pinned}{' '}
                      <i>
                        <TimeAgo
                          date={pinnedComment.moderation?.updated_at}
                          formatter={formatter}
                        />
                      </i>{' '}
                    </span>
                    <i
                      className="fa-solid fa-map-pin"
                      style={{
                        textAlign: 'right',
                        marginLeft: '10px',
                      }}
                    ></i>
                  </>
                }
                {(author.role?.type as any) === RoleType.Admin && (
                  <div className="moderation-label">{GERMAN.moderation}</div>
                )}
              </small>
            </CardSubtitle>
            {pinnedComment.moderation.reason ? (
              <div className="card-text">
                <p
                  style={{
                    whiteSpace: 'pre-line',
                  }}
                >
                  {pinnedComment.moderation.reason as string}
                </p>
              </div>
            ) : (
              <div className="card-text">
                <p
                  style={{
                    whiteSpace: 'pre-line',
                  }}
                >
                  -
                </p>
              </div>
            )}
            <div className="moderation-debate-reply">
              <small>
                <>
                  <Link to={`/user/${(pinnedComment?.user as User).id}`}>
                    <>{(pinnedComment?.user as User).username}</>
                  </Link>{' '}
                  <span>
                    kommentierte{' '}
                    <i>
                      <TimeAgo date={pinnedComment.created_at} />
                    </i>{' '}
                  </span>
                </>
              </small>
              <p
                style={{
                  whiteSpace: 'pre-line',
                }}
              >
                {pinnedComment.comment}
              </p>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
  return null;
};
