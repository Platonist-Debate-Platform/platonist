import React from 'react';
import { useSelector } from 'react-redux';
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
    Comment,
    User
  } from '@platonist/library';
import { Form } from '../../../../Library';
import { SubmitButton } from '../../../../Library/Form/Fields';
import classNames from 'classnames';
import { CommentForm, CommentListItem } from '../../Comment';
import './ModerationPanel.scss'
import { match as Match} from 'react-router';
import { ModerationReplyItem } from './ModerationReplyItem';

export interface ModerationPanelProps {
    comments?: Comment[];
    canEdit?: boolean;
    debateId?: any;
    isDetail?: boolean;
    match: Match<{ commentId?: string }>;
    onSubmit: () => void;
    path: string;
}

export const ModerationPanel: React.FunctionComponent<ModerationPanelProps> = (props) => {
    const {
        comments, canEdit, debateId, isDetail, match, onSubmit, path
    } = props;
    const { result: role } = useSelector<GlobalState, GlobalState[PrivateRequestKeys.Role]>((state) => state.role)
    const { result: debate } = useSelector<GlobalState, GlobalState[PublicRequestKeys.Debate]>((state) => state.debate)

    return (
        <>
            <div>
                <div className="moderation-panel-parent">
                    <div className="moderation-container">
                        {
                            comments && comments.map((comment, index) => {
                                if (comment.moderator) {
                                    return <CommentListItem
                                        canEdit={true}
                                        debateId={debateId}
                                        isDisputed={false}
                                        isDetail={false}
                                        key={`comment_list_item_${comment.id}_${index}`}
                                        match={match}
                                        onSubmit={onSubmit}
                                        path={path}
                                        {...comment}
                                    />
                                }
                                if (comment.replies && comment.replies.length > 0) {
                                    return comment.replies.map((c, i) => {
                                        const mod = c?.moderator;
                                        if (mod) {
                                            return (
                                                <ModerationReplyItem
                                                    mod={mod}
                                                    key={`comment_list_item_${comment.id}_${i}`}
                                                    comment={comment}
                                                />
                                            )
                                        }
                                    })
                                }

                                return null;
                            })
                        }
                    </div>
                </div>
                {
                    role?.role.type === 'admin' && <div className="moderation-panel-participation">
                        {/* <Form
                            asForm
                        >
                            <div className="text-right">
                                <SubmitButton
                                    className={classNames('btn-success')}
                                    preventDefault
                                    type="submit"
                                >
                                    Save Comment <i className="fa fa-cloud-upload-alt" />
                                </SubmitButton>

                            </div>
                        </Form> */}
                        {
                            debate && <CommentForm
                                debateId={debate.id}
                            />
                        }
                    </div>
                }
            </div>
        </>
    );
}