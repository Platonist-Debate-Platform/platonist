import React, { useEffect, useState } from 'react';
import { TypingUsers } from './CommentForm';
import { GlobalState, PrivateRequestKeys } from '@platonist/library';
import { useSelector } from 'react-redux';
import './TypingUsersItem.scss';
import { createSocket } from '../../Hooks';

export interface TypingUsersProps {
  debateId: number;
}

export const TypingUsersItem: React.FunctionComponent<TypingUsersProps> = (
  props: TypingUsersProps,
) => {
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);
  const [socket] = useState(createSocket());
  const [typingUsers, setTypingUsers] = useState<TypingUsers[]>([]);

  useEffect(() => {
    socket.emit(`notification`, { id: props.debateId });
    socket.on(`debate:${props.debateId}`, (data) => {
      if (data.typingUsers) {
        setTypingUsers(data.typingUsers);
      }
    });
  }, [props.debateId, socket, user]);

  return (
    <>
      {typingUsers.length > 0 && (
        <div className="typing-users-parent">
          {typingUsers &&
            typingUsers.map((e) => {
              return (
                <>
                  <div
                    className="typing-users-item"
                    key={`typing-user-${e.user.username}`}
                  >
                    <div>
                      {e.user.username !== user?.username ? (
                        <span>{e.user.username} schreibt</span>
                      ) : (
                        <span>Du schreibst</span>
                      )}
                      <span className="loading-fade">&nbsp; . . .</span>
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      )}
    </>
  );
};
