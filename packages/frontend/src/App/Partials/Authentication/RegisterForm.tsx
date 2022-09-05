import { FunctionComponent } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Form } from 'reactstrap';

import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
  User,
} from '@platonist/library';

import {
  AutocompleteKeys,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';

export interface RegisterData extends User {
  passwordRepeat: string;
}

const registerFormData: FormDataConfig<Partial<RegisterData>>[] = [
  {
    editable: true,
    key: 'username',
    required: true,
    title: 'Benutzername',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'firstName',
    required: true,
    title: 'Vorname',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'lastName',
    required: true,
    title: 'Nachname',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    autocomplete: AutocompleteKeys.Email,
    editable: true,
    key: 'email',
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
    title: 'Passwort',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Password,
  },
  {
    autocomplete: AutocompleteKeys.CurrentPassword,
    compareKey: 'password',
    editable: true,
    key: 'passwordRepeat',
    required: true,
    title: 'Passwort wiederholen',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Equal,
    validateOptions: {},
  },
];

export interface RegisterFormProps {
  [PublicRequestKeys.Authentication]: GlobalState[PublicRequestKeys.Authentication];
}

export const RegisterFormWithoutState: FunctionComponent<RegisterFormProps> = ({
  authentication,
}) => {
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/local/register`;

  const handleSubmit = (event: FormClickEvent<Partial<RegisterData>>) => {
    if (!event.submitData.isValid) {
      return;
    }

    const data = event.submitData.data;

    if (data.passwordRepeat) {
      delete data.passwordRepeat;
    }

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
      data={{ username: '', email: '', password: '', passwordRepeat: '' }}
      inputConfig={registerFormData}
    >
      <h2>Registrierung</h2>
      <p>
        ​​Zur Teilnahme an den Debatten ist der Login mit deinem Konto
        erforderlich. Wenn Du noch kein Konto bei Platonist angelegt hast,
        registriere dich bitte hier.
      </p>
      <Form>
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="username"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="firstName"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="lastName"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="email"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="password"
        />
        <Input
          disabled={authentication?.status === RequestStatus.Updating}
          inputKey="passwordRepeat"
        />
        <div className="text-right">
          <SubmitButton
            className="btn-sm btn-primary"
            disabled={authentication?.status === RequestStatus.Updating}
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Registrieren <i className="fa fa-user-plus" />
          </SubmitButton>
        </div>
      </Form>
    </FormProvider>
  );
};

export const RegisterForm = connect((state: GlobalState) => ({
  [PublicRequestKeys.Authentication]: state[PublicRequestKeys.Authentication],
}))(RegisterFormWithoutState);
