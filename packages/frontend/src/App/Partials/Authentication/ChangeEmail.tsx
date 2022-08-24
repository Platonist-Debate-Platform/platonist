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

interface ChangeEmailData {
  email: string;
  emailRepeat: string;
}

const changeEmailFormData: FormDataConfig<Partial<ChangeEmailData>>[] = [
  {
    autocomplete: AutocompleteKeys.Email,
    editable: true,
    key: 'email',
    required: true,
    title: 'Neue Emailadresse',
    type: FormInputTypes.Email,
    validate: FormValidationTypes.Email,
  },
  {
    autocomplete: AutocompleteKeys.Email,
    compareKey: 'email',
    editable: true,
    key: 'emailRepeat',
    required: true,
    title: 'Emailadresse wiederholen',
    type: FormInputTypes.Email,
    validate: FormValidationTypes.Equal,
    validateOptions: {},
  },
];

export const ChangeEmail: FunctionComponent<{
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
    (event: FormClickEvent<Partial<ChangeEmailData>>) => {
      if (!event.submitData.isValid) {
        return;
      }

      const data = event.submitData.data;

      if (data.emailRepeat) {
        delete data.emailRepeat;
      }

      send({
        data,
        method: 'POST',
        pathname: '/auth/local/change-email',
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
      data={{ email: '', emailRepeat: '' }}
      inputConfig={changeEmailFormData}
      reset={shouldReset || reset}
    >
      <Form>
        <Input disabled={status === RequestStatus.Updating} inputKey="email" />
        <Input
          disabled={status === RequestStatus.Updating}
          inputKey="emailRepeat"
        />
        <div className="text-right">
          <SubmitButton
            className="btn-sm btn-primary"
            disabled={status === RequestStatus.Updating}
            onClick={handleSubmit}
            preventDefault={true}
            type="submit"
          >
            Speichern <i className="fa fa-save" />
          </SubmitButton>
        </div>
      </Form>
      {redirectTarget && shouldReset && <Redirect to={redirectTarget} />}
    </FormProvider>
  );
};
