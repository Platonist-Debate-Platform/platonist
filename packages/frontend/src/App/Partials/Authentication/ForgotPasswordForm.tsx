import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';
import React from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import {
  FormDataConfig,
  AutocompleteKeys,
  FormInputTypes,
  FormValidationTypes,
  FormProvider,
  FormClickEvent,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';

export interface ForgotPasswordData {
  identifier: string;
  // email: string;
}

const forgotPasswordForm: FormDataConfig<Partial<ForgotPasswordData>>[] = [
  {
    autocomplete: AutocompleteKeys.Email,
    editable: true,
    key: 'identifier',
    required: true,
    title: 'E-Mail',
    type: FormInputTypes.Email,
    validate: FormValidationTypes.Email,
  },
];

export interface ForgotPasswordFormProps {
  [PublicRequestKeys.Authentication]: GlobalState[PublicRequestKeys.Authentication];
}

export const ForgotPasswordFormWithoutState: React.FunctionComponent<
  ForgotPasswordFormProps
> = ({ authentication }) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/forgot-password`;
  const handleSubmit = (event: FormClickEvent<ForgotPasswordData>) => {
    if (!event.submitData.isValid) {
      return;
    }

    const data = event.submitData.data;

    dispatch(
      requestAction.load(PublicRequestKeys.Authentication, {
        data,
        method: 'post',
        url: url.href,
        withCredentials: true,
      }),
    );
  };

  if (authentication && authentication.status === 'LOADED' && authentication.meta) {
    return (
      <>
        <div className="border border-info bg-info p-3 rounded">
          <p className="text-white">Ein Link, um dein Passwort zurückzusetzen wurde an deine Emailadresse zugestellt. Schau in deinem Postfach nach.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Password vergessen</h2>
      <FormProvider inputConfig={forgotPasswordForm} data={{ identifier: '' }}>
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="identifier"
        />
        <div className="text-right">
          <SubmitButton
            className="btn-sm btn-primary"
            disabled={authentication?.status === RequestStatus.Updating}
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Senden <i className="fa fa-sign-in-alt" />
          </SubmitButton>
        </div>
      </FormProvider>
    </>
  );
};

export const ForgotPasswordForm = connect((state: GlobalState) => ({
  [PublicRequestKeys.Authentication]: state[PublicRequestKeys.Authentication],
}))(ForgotPasswordFormWithoutState);
