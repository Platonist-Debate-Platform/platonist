import { Comment } from '@platonist/library';
import React from 'react';
import './ModerationPanel.scss';
import { Card, CardBody, CardSubtitle } from 'reactstrap';
import { GlobalState, PrivateRequestKeys, User } from '@platonist/library';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago2';

export interface ModerationPinnedItemProps {
  pinnedComment: Comment;
}

export const ModerationPinnedItem: React.FunctionComponent<
  ModerationPinnedItemProps
> = (props) => {
  const { pinnedComment } = props;
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);

  if (typeof pinnedComment.moderation === 'number') return null;

  if (pinnedComment.moderation) {
    const createdAt = new Date(pinnedComment.created_at);
    const updatedAt = new Date(pinnedComment.updated_at);
    const modCreatedAt = new Date(pinnedComment.moderation.created_at);
    const modUpdatedAt = new Date(pinnedComment.moderation.updated_at);
    return (
        <>
          <Card className="comment-list-item parent">
            <CardBody>
              <CardSubtitle>
                <small>
                  {(user as User) && (
                    <>
                      <i className="fa fa-exclamation-triangle text-danger" style={{marginRight: "3px"}}></i>
                      <Link
                        to={`/user/${
                          pinnedComment.moderation.moderator === user?.id ? 'me' : (pinnedComment.moderation.user as User).id
                        }`}
                      >
                        {pinnedComment.moderation?.moderator === user?.id ? 'You' : <>{pinnedComment.moderation?.user.username}</>}
                      </Link>{' '}
                      <span>
                        pinned{' '}
                        <i>
                          <TimeAgo date={pinnedComment.moderation?.updated_at} />
                        </i>{' '}
                      </span>
                      <i
                        className="fa-solid fa-bell"
                        style={{
                          textAlign: 'right',
                          marginLeft: '10px',
                        }}
                      ></i>
                    </>
                  )}
                </small>
              </CardSubtitle>
              {
                  pinnedComment.moderation.reason ? <div className="card-text">
                    <p
                        style={{
                            whiteSpace: "pre-line"
                        }}
                    >
                        {(pinnedComment.moderation.reason as string)}
                    </p>
                  </div> : <div className="card-text">
                    <p
                        style={{
                            whiteSpace: "pre-line"
                        }}
                    >
                        -
                    </p>
                  </div>
              }
              <div className="moderation-debate-reply">
                  <small>
                      <>
                      <Link
                        to={`/user/${user?.id === ((pinnedComment.user as User).id) ? 'me' : (pinnedComment?.user as User).id}`}
                        >
                            {user?.id === ((pinnedComment.user as User).id) ? 'You' : <>{(pinnedComment?.user as User).username}</>}
                            </Link>{' '}
                            <span>
                            commented{' '}
                            <i>
                                <TimeAgo date={pinnedComment.created_at} />
                            </i>{' '}
                        </span>
                      </>
                  </small>
                  <p
                    style={{
                        whiteSpace: "pre-line"
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