import classNames from 'classnames';
import {
  Comment,
  CommentStatus,
  Debate,
  GlobalState,
  PrivateRequestKeys,
  RequestStatus,
  User,
} from '@platonist/library';
import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { usePrevious } from 'react-use';
import {} from 'reactstrap';

import {
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { SubmitButton } from '../../../Library/Form/Fields';
import { Form, FromKeyboardEvent } from '../../../Library/Form';
import { createSocket, useAuthentication, useComments } from '../../Hooks';
import { useSelector } from 'react-redux';

const commentFormData: FormDataConfig<Partial<Comment>>[] = [
  {
    editable: true,
    key: 'comment',
    required: true,
    title: 'Neuer Kommentar schreiben',
    type: FormInputTypes.Text,
    usePicker: true,
    validate: FormValidationTypes.Words,
  },
];

export interface CommentFormProps {
  commentId?: Comment['id'];
  debateId: Debate['id'];
  defaultData?: Partial<Comment>;
  dismissElement?: ReactElement<any, any>;
  onSuccess?: (isNew: boolean) => void;
  parent?: Comment['id'];
  reset?: boolean;
}

export interface TypingUsers {
  user: User;
  comment: Comment;
}

export const CommentForm: FunctionComponent<CommentFormProps> = ({
  commentId,
  debateId,
  defaultData,
  dismissElement,
  onSuccess,
  parent,
  reset,
}) => {
  const { result: role } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.Role]
  >((state) => state.role);
  const [isAuthenticated, state] = useAuthentication();
  const [shouldReset, setShouldReset] = useState(false);
  const [socket] = useState(createSocket());
  const [typingUsers, setTypingUsers] = useState<TypingUsers[]>([]);
  const {
    clear,
    send,
    state: { status, result: comment },
  } = useComments<Comment>({
    key: PrivateRequestKeys.Comment,
    stateOnly: true,
  });

  const prevStatus = usePrevious(status);

  const handleSubmit = useCallback(
    (
      event:
        | FormClickEvent<Partial<Comment>>
        | FromKeyboardEvent<Partial<Comment>>,
    ) => {
      if (!isAuthenticated && !state && !event.submitData.isValid) {
        return;
      }

      const data = {
        ...event.submitData.data,
        created_by: state?.id,
        debate: (!parent && debateId) || undefined,
        status: (state?.status as CommentStatus) || CommentStatus.Active,
        updated_by: state?.id,
        user: state?.id,
        moderator: role?.role.type === 'admin' ? state?.id : undefined,
      };

      if (parent) {
        data.parent = parent;
      }

      send({
        data,
        method: defaultData ? 'PUT' : 'POST',
        pathname: `/comments${commentId ? '/' + commentId : ''}`,
      });
    },
    [
      commentId,
      debateId,
      defaultData,
      isAuthenticated,
      parent,
      send,
      state,
      role,
    ],
  );

  const handleKeyDown = useCallback(
    (event: FromKeyboardEvent<Partial<Comment>>) => {
      if (
        event.nativeEvent.ctrlKey &&
        (event.key === 'Enter' || event.key === 'enter')
      ) {
        handleSubmit(event);
      }
    },
    [handleSubmit],
  );

  useEffect(() => {
    socket.on('typing', (data: { typingUsers: TypingUsers[] }) => {
      setTypingUsers(data.typingUsers);
    });
  }, [socket, typingUsers]);

  useEffect(() => {
    if (
      prevStatus === RequestStatus.Updating &&
      status === RequestStatus.Loaded &&
      comment
    ) {
      clear();

      if (!shouldReset) {
        setShouldReset(true);
      }

      if (onSuccess) {
        onSuccess(!defaultData && !commentId);
      }
    }

    if (shouldReset) {
      setShouldReset(false);
    }
  }, [
    clear,
    comment,
    commentId,
    defaultData,
    onSuccess,
    prevStatus,
    shouldReset,
    status,
  ]);

  return (
    (isAuthenticated && (
      <FormProvider
        data={defaultData || { comment: '' }}
        inputConfig={commentFormData}
        reset={shouldReset || reset}
      >
        <Form socket={socket} asForm={true} onKeyDown={handleKeyDown}>
          <div className="text-right">
            {dismissElement && <>{dismissElement}</>}
            <SubmitButton
              className={classNames('btn-success', {
                'btn-sm': defaultData,
              })}
              disabled={status === RequestStatus.Updating}
              onClick={(e: FormClickEvent<Partial<Comment>>) => handleSubmit(e)}
              preventDefault={true}
              type="submit"
            >
              Save Comment <i className="fa fa-cloud-upload-alt" />
            </SubmitButton>
          </div>
        </Form>
      </FormProvider>
    )) ||
    null
  );
};
