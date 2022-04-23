import {
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
  randomHash,
  RequestStatus,
  User,
} from '@platonist/library';
import { SubmitButton } from '../../../Library/Form/Fields';
import { FunctionComponent } from 'react';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { usePrevious } from 'react-use';
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from 'reactstrap';

import {
  createDefaultData,
  Form,
  FormClickEvent,
  FormDataConfig,
  FormEvent,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
  getDefaultDataFromResult,
} from '../../../Library';
import useUser from '../../Hooks/Requests/useUser';

const profileFormData: FormDataConfig<Partial<User>>[] = [
  {
    editable: true,
    key: 'firstName',
    required: true,
    title: 'First name',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: true,
    key: 'lastName',
    required: true,
    title: 'Last name',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
  {
    editable: false,
    key: 'username',
    required: true,
    title: 'Username',
    type: FormInputTypes.String,
    validate: FormValidationTypes.Length,
  },
];

export const ProfileFormBase: FunctionComponent<{
  userState: GlobalState[PrivateRequestKeys.User];
}> = ({ userState }) => {
  const { send } = useUser<User>();

  const prevUserState = usePrevious(userState);

  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);

  const handleSubmit = <
    Ev extends FormClickEvent<Partial<User>> | FormEvent<Partial<User>>,
  >(
    event: Ev,
  ) => {
    if (!event.submitData.isValid && !userState.result) {
      return;
    }

    const data = event.submitData.data;

    send({
      data: {
        ...userState.result,
        ...data,
      },
      method: 'PUT',
    });
  };

  return (
    <FormProvider
      inputConfig={profileFormData}
      data={
        (userState.result &&
          getDefaultDataFromResult<Partial<User>>(
            userState.result,
            profileFormData,
          )) ||
        createDefaultData<Partial<User>>(profileFormData)
      }
      reset={userState.hash !== prevUserState?.hash}
    >
      <Form asForm={true} onSubmit={handleSubmit}>
        <FormGroup>
          <Label>E-Mail</Label>
          <InputGroup>
            <Input
              type="email"
              disabled={true}
              value={userState.result?.email}
              onChange={() => {}}
            />
            <Link
              to={`${location.pathname}?modal=change-email`}
              className="input-group-append d-flex"
            >
              <InputGroupText>
                <i className="fa fa-edit" />
              </InputGroupText>
            </Link>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input
              type="password"
              disabled={true}
              defaultValue={randomHash(12)}
            />
            <Link
              to={`${location.pathname}?modal=change-password`}
              className="input-group-append d-flex"
            >
              <InputGroupText>
                <i className="fa fa-edit" />
              </InputGroupText>
            </Link>
          </InputGroup>
        </FormGroup>
        <div className="text-right">
          <SubmitButton
            className={'btn-success'}
            onClick={(ev) => handleSubmit(ev as any)}
            disabled={userState.status === RequestStatus.Updating}
          >
            Save <i className="fa fa-save" />
          </SubmitButton>
        </div>
      </Form>
    </FormProvider>
  );
};

export const ProfileForm = connect((state: GlobalState) => ({
  userState: state[PrivateRequestKeys.User],
}))(ProfileFormBase);
