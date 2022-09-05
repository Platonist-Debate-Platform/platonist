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
import { Redirect, useHistory } from 'react-router';

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
    title: 'Neues Passwort',
    type: FormInputTypes.Password,
    validate: FormValidationTypes.Password,
  },
  {
    autocomplete: AutocompleteKeys.CurrentPassword,
    compareKey: 'password',
    editable: true,
    key: 'passwordConfirmation',
    required: true,
    title: 'Neues Passwort wiederholen',
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
  const history = useHistory();
  const { location } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Router]
  >((state) => state.router);
  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.createApiUrl(config.api.config);
  url.pathname = `/auth/reset-password`;

  const search = new URLSearchParams(window.location.search);
  const code = search.get('code');

  const handleSubmit = (event: FormClickEvent<Partial<ResetPasswordData & { code: string }>>) => {
    if (!event.submitData.isValid) {
      return;
    }    

    const data = event.submitData.data;
    if (code) data.code = code;

    dispatch(
      requestAction.load(PublicRequestKeys.Authentication, {
        data,
        method: 'post',
        url: url.href + location.search,
        withCredentials: true,
      }),
    );
  };

  if (!code) return <Redirect to="/" />

  if (authentication.status === 'LOADED' && authentication.meta) {
    setTimeout(() => {
      history.push('/');
    }, 5000)
    return <section className="section section-authenticate">
      <Container>
        <Row>
          <Col md={8} className="offset-md-2">
            <div className="border border-info bg-info p-3 rounded">
            <p className="text-white">Dein Passwort wurde erfolgreich geändert.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  }

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
