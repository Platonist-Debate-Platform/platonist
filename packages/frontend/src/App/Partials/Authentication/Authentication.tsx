import React, { FunctionComponent, ReactElement, useState } from 'react';
import { Button, Collapse } from 'reactstrap';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export interface AuthenticationProps {
  infoText?: ReactElement;
}

export enum AuthenticationPages {
  Login = 'login',
  Register = 'register',
  ForgotPassword = 'forgot-password',
}

export const Authentication: FunctionComponent<AuthenticationProps> = ({
  infoText,
}) => {
  const [panel, setPanel] = useState<AuthenticationPages>(
    AuthenticationPages.Login,
  );

  const handleClick = (type: AuthenticationPages) => {
    setPanel(type);
  };

  return (
    <div className="authentication">
      {infoText || (
        <p>
          ​​Zur Teilnahme an den Debatten ist der Login mit deinem Konto
          erforderlich. Wenn Du noch kein Konto bei Platonist angelegt hast,
          registriere dich bitte hier.
        </p>
      )}
      <Collapse isOpen={panel === AuthenticationPages.Login}>
        <div className="authentication-modal-login">
          <LoginForm />
        </div>
      </Collapse>
      <Collapse isOpen={panel === AuthenticationPages.Register}>
        <div className="authentication-modal-register">
          <RegisterForm />
        </div>
      </Collapse>
      <Collapse isOpen={panel === AuthenticationPages.ForgotPassword}>
        <div className="authentication-modal-forgot-password">
          <ForgotPasswordForm />
        </div>
      </Collapse>
      <div className="authentication-modal-toggle">
        {panel === AuthenticationPages.ForgotPassword && (
          <>
            <Button
              size="sm"
              color="none"
              onClick={() => handleClick(AuthenticationPages.Login)}
            >
              {'Hier einloggen'}
            </Button>
            <Button
              size="sm"
              color="none"
              onClick={() => handleClick(AuthenticationPages.Register)}
            >
              {'Hier registrieren'}
            </Button>
          </>
        )}
        {panel !== AuthenticationPages.ForgotPassword && (
          <>
            {panel === AuthenticationPages.Register && (
              <Button
                size="sm"
                color="none"
                onClick={() => handleClick(AuthenticationPages.Login)}
              >
                {'Hier einloggen'}
              </Button>
            )}
            {panel === AuthenticationPages.Login && (
              <Button
                size="sm"
                color="none"
                onClick={() => handleClick(AuthenticationPages.Register)}
              >
                {'Hier registrieren'}
              </Button>
            )}
            <Button
              size="sm"
              color="none"
              onClick={() => handleClick(AuthenticationPages.ForgotPassword)}
            >
              Passwort vergessen
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
