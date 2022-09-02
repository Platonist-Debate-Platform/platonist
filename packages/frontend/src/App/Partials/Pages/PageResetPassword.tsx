import {
  GlobalState,
  PublicRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  useConfig,
} from '@platonist/library';
import { RequestStatus } from '@platonist/library/build/ReactReduxRequest/Keys';
import React from 'react';
import {
  AutocompleteKeys,
  FormClickEvent,
  FormDataConfig,
  FormInputTypes,
  FormProvider,
  FormValidationTypes,
} from '../../../Library';
import { Input, SubmitButton } from '../../../Library/Form/Fields';
import { Form } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { useSelector } from 'react-redux';

interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
}

const resetPasswordForm: FormDataConfig<Partial<ResetPasswordData>>[] = [
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
    key: 'passwordConfirmation',
    required: true,
    title: 'Passwort wiederholen',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Equal,
    validateOptions: {},
  },
];

export interface PageResetPasswordProps {
  [PublicRequestKeys.Authentication]: GlobalState[PublicRequestKeys.Authentication];
}

export const PageResetPasswordWithoutState: React.FunctionComponent<
  PageResetPasswordProps
> = ({ authentication }) => {
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/reset-password`;

  const handleSubmit = (event: FormClickEvent<Partial<ResetPasswordData>>) => {
    if (!event.submitData.isValid) {
      return;
    }

    const data = event.submitData.data;

    // console.log(url.href, location);

    dispatch(
      requestAction.load(PublicRequestKeys.Authentication, {
        data,
        method: 'post',
        url: url.href + location.search,
        withCredentials: true,
      }),
    );
  };

  return (
    <>
      <section className="section section-authenticate">
        <Container>
          <Row>
            <Col md={8} className="offset-md-2">
              <h2>Passwort zurücksetzen</h2>
              <FormProvider
                inputConfig={resetPasswordForm}
                data={{ password: '', passwordConfirmation: '' }}
              >
                <Form>
                  <Input
                    disabled={authentication?.status === RequestStatus.Updating}
                    inputKey="password"
                  />
                  <Input
                    disabled={authentication?.status === RequestStatus.Updating}
                    inputKey="passwordConfirmation"
                  />
                  <div className="text-right">
                    <SubmitButton
                      className="btn-sm btn-primary"
                      disabled={
                        authentication?.status === RequestStatus.Updating
                      }
                      onClick={handleSubmit}
                      preventDefault={true}
                      type="submit"
                    >
                      Password zurücksetzen <i className="fa fa-user-plus" />
                    </SubmitButton>
                  </div>
                </Form>
              </FormProvider>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export const PageResetPassword = connect((state: GlobalState) => ({
  [PublicRequestKeys.Authentication]: state[PublicRequestKeys.Authentication],
}))(PageResetPasswordWithoutState);
