import { RequestStatus, User } from '@platonist/library';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Redirect } from 'react-router-dom';
import { usePrevious } from 'react-use';
import { Form } from 'reactstrap';

import {
  AutocompleteKeys,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';
import useUser from '../../Hooks/Requests/useUser';

interface ChangePasswordData {
  oldPassword: string;
  password: string;
  passwordRepeat: string;
}

const changePasswordFormData: FormDataConfig<Partial<ChangePasswordData>>[] = [
  {
    autocomplete: AutocompleteKeys.Email,
    editable: true,
    key: 'oldPassword',
    required: true,
    title: 'Old password',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Length,
  },
  {
    autocomplete: AutocompleteKeys.CurrentPassword,
    editable: true,
    key: 'password',
    required: true,
    title: 'Password',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Password,
  },
  {
    autocomplete: AutocompleteKeys.CurrentPassword,
    compareKey: 'password',
    editable: true,
    key: 'passwordRepeat',
    required: true,
    title: 'Repeat password',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Equal,
    validateOptions: {},
  },
];

export const ChangePassword: FunctionComponent<{
  redirectTarget?: string;
  reset?: boolean;
}> = ({ redirectTarget, reset }) => {
  const {
    user: { result: user, status },
    send,
  } = useUser<User>();

  const prevStatus = usePrevious(status);
  const [shouldReset, setShouldReset] = useState(false);

  const handleSubmit = useCallback(
    (event: FormClickEvent<Partial<ChangePasswordData>>) => {
      if (!event.submitData.isValid) {
        return;
      }

      const data = event.submitData.data;

      if (data.passwordRepeat) {
        delete data.passwordRepeat;
      }

      send({
        data,
        method: 'POST',
        pathname: '/auth/local/change-password',
      });
    },
    [send],
  );

  useEffect(() => {
    if (
      status === RequestStatus.Loaded &&
      prevStatus === RequestStatus.Updating &&
      !shouldReset &&
      user
    ) {
      setShouldReset(true);
    }
    if (status === RequestStatus.Loaded && shouldReset && user) {
      setShouldReset(false);
    }
  }, [prevStatus, shouldReset, status, user]);

  return (
    <FormProvider
      data={{ oldPassword: '', password: '', passwordRepeat: '' }}
      inputConfig={changePasswordFormData}
      reset={shouldReset || reset}
    >
      <Form>
        <Input
          disabled={status === RequestStatus.Updating}
          inputKey="oldPassword"
        />
        <Input
          disabled={status === RequestStatus.Updating}
          inputKey="password"
        />
        <Input
          disabled={status === RequestStatus.Updating}
          inputKey="passwordRepeat"
        />
        <div className="text-right">
          <SubmitButton
            className="btn-sm btn-primary"
            disabled={status === RequestStatus.Updating}
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Save <i className="fa fa-save" />
          </SubmitButton>
        </div>
      </Form>
      {redirectTarget && shouldReset && <Redirect to={redirectTarget} />}
    </FormProvider>
  );
};
