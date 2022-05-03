import React from 'react';
import { TypingUsers } from './CommentForm';
import {
    ApplicationKeys,
    Comment,
    CommentStatus,
    Debate,
    GlobalState,
    PrivateRequestKeys,
    PublicRequestKeys,
    RestMethodKeys,
    RolePermissionTypes,
    RoleState,
    User,
  } from '@platonist/library';
import { useSelector } from 'react-redux';
import './TypingUsersItem.scss';

export interface TypingUsersProps {
    typingUsers: TypingUsers[]; 
}

export const TypingUsersItem: React.FunctionComponent<TypingUsersProps> = (props: TypingUsersProps) => {
    const { typingUsers } = props;
    const { result: user } = useSelector<
        GlobalState,
        GlobalState[PrivateRequestKeys.User]
    >((state) => state.user);
    return (
        <>
            <div className="typing-users-parent">
                {
                    typingUsers && typingUsers.map(e => {
                        if (e.user.username === user?.username) return null;
                        return (
                            <>
                                <div className="typing-users-item" key={`typing-user-${e.user.username}`}>
                                    <div>
                                        <span>{e.user.username} is typing</span>
                                        <span className="loading-fade">&nbsp; . . .</span>
                                    </div>
                                </div>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}