import {
  Comment,
  CommentStatus,
  Moderation,
  PublicRequestKeys,
  RequestMethod,
  RequestStatus,
  User,
} from '@platonist/library';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router';
import { useUnmount, usePrevious } from 'react-use';
import {
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { Select, SubmitButton, Text } from '../../../Library/Form/Fields';
import { useModerations, useUser } from '../../Hooks';
import { ModalWithRoute, ModalWithRouteProps } from '../Modal';

interface CommentModerationProps {
  commentId: Comment['id'];
  from: ModalWithRouteProps['from'];
  hasModeration: boolean;
  to: ModalWithRouteProps['to'];
}

const commentFormData: FormDataConfig<Partial<Moderation>>[] = [
  {
    editable: true,
    key: 'status',
    required: true,
    title: 'Set comment Status',
    type: FormInputTypes.Select,
    selectValues: [
      CommentStatus.Active,
      CommentStatus.Blocked,
      CommentStatus.Disputed,
    ],
  },
  {
    editable: true,
    key: 'reason',
    required: false,
    title: 'Reason for disputing or blocking this Comment',
    type: FormInputTypes.Text,
    validate: FormValidationTypes.Words,
  },
];

const ModerationModalHeader = () => <>Moderate Comment</>;

export const CommentModeration: FunctionComponent<CommentModerationProps> = ({
  commentId,
  from,
  hasModeration,
  to,
}) => {
  const [formData, setFormData] = useState<Partial<Moderation> | undefined>();
  const [saving, setSaving] = useState<boolean>(false);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);

  const {
    clear,
    state: { status, result: moderation },
    send,
    load,
  } = useModerations<Moderation>({
    key: PublicRequestKeys.Moderation,
    path: `moderations/byCommentId/${commentId}`,
    stateOnly: true,
  });

  const {
    user: { result: user },
  } = useUser<User>();

  const prevModeration = usePrevious(moderation);

  const handleClosing = useCallback(() => {
    if (status === RequestStatus.Loaded && moderation) {
      clear();
      if (saving) {
        setSaving(false);
      }
    }
  }, [clear, moderation, saving, status]);

  const handleOpening = useCallback(() => {
    if (status === RequestStatus.Initial && !moderation && hasModeration) {
      load();
    }
  }, [moderation, load, status, hasModeration]);

  const handleSubmit = useCallback(
    ({ submitData }: FormClickEvent<Partial<Moderation>>) => {
      if (submitData && submitData.data && submitData.isValid) {
        send({
          method: hasModeration ? RequestMethod.Update : RequestMethod.Create,
          data: {
            moderator: user?.id,
            comment: commentId,
            ...submitData.data,
          },
          pathname: `moderations${moderation?.id ? '/' + moderation.id : ''}`,
        });

        if (!saving) {
          setSaving(true);
        }
      }
    },
    [send, hasModeration, user?.id, commentId, moderation?.id, saving],
  );

  useEffect(() => {
    if (!formData && !hasModeration) {
      setFormData({
        status: CommentStatus.Active,
        reason: '',
      });
    }
    if (!formData && moderation) {
      setFormData({
        status: moderation.status || CommentStatus.Active,
        reason: moderation.reason,
      });
    }

    if (
      status === RequestStatus.Loaded &&
      moderation?.updated_by !== prevModeration?.updated_at &&
      saving
    ) {
      setSaving(false);
      setShouldRedirect(true);
    }

    if (status === RequestStatus.Error && saving) {
      setSaving(false);
    }

    if (shouldRedirect && !saving) {
      setShouldRedirect(false);
    }
  }, [
    moderation,
    formData,
    load,
    status,
    hasModeration,
    prevModeration?.updated_at,
    saving,
    shouldRedirect,
  ]);

  useUnmount(() => {
    if (status === RequestStatus.Loaded && moderation) {
      clear();
    }
  });

  return (
    <ModalWithRoute
      from={from}
      header={<ModerationModalHeader />}
      onClosed={handleClosing}
      onOpened={handleOpening}
      size="lg"
      to={to}
    >
      {formData && (
        <FormProvider data={formData} inputConfig={commentFormData}>
          <Select inputKey="status" />
          <Text inputKey="reason" />
          <SubmitButton
            className="btn btn-green btn-small"
            onClick={handleSubmit}
          >
            Save
          </SubmitButton>
        </FormProvider>
      )}
      {shouldRedirect && <Redirect to={from} />}
    </ModalWithRoute>
  );
};
