import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
} from '@platonist/library';
import React, { FunctionComponent } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Form } from 'reactstrap';

import {
  AutocompleteKeys,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
  useConfig,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';

interface LoginData {
  identifier: string;
  password: string;
}

const loginFormData: FormDataConfig<Partial<LoginData>>[] = [
  {
    autocomplete: AutocompleteKeys.Email,
    editable: true,
    key: 'identifier',
    required: true,
    title: 'E-Mail',
    type: FormInputTypes.Email,
    validate: FormValidationTypes.Email,
  },
  {
    autocomplete: AutocompleteKeys.CurrentPassword,
    editable: true,
    key: 'password',
    required: true,
    title: 'Password',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Length,
    validateOptions: {
      min: 8,
    },
  },
];

export interface LoginFormProps {
  [PublicRequestKeys.Authentication]: GlobalState[PublicRequestKeys.Authentication];
}

export const LoginFormWithoutState: FunctionComponent<LoginFormProps> = ({
  authentication,
}) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/local`;

  const handleSubmit = (event: FormClickEvent<LoginData>) => {
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

  return (
    <FormProvider
      data={{ identifier: '', password: '' }}
      inputConfig={loginFormData}
    >
      <Form>
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="identifier"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="password"
        />
        <div className="text-right">
          <SubmitButton
            className="btn-sm btn-primary"
            disabled={authentication?.status === RequestStatus.Updating}
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Sign in <i className="fa fa-sign-in-alt" />
          </SubmitButton>
        </div>
      </Form>
    </FormProvider>
  );
};

export const LoginForm = connect((state: GlobalState) => ({
  [PublicRequestKeys.Authentication]: state[PublicRequestKeys.Authentication],
}))(LoginFormWithoutState);
