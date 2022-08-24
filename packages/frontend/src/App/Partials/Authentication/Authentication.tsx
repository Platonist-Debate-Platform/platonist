import React, { FunctionComponent, ReactElement, useState } from 'react';
import { Button, Collapse } from 'reactstrap';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export interface AuthenticationProps {
  infoText?: ReactElement;
}

export const Authentication: FunctionComponent<AuthenticationProps> = ({
  infoText,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
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
      <Collapse isOpen={!open}>
        <div className="authentication-modal-login">
          <LoginForm />
        </div>
      </Collapse>
      <Collapse isOpen={open}>
        <div className="authentication-modal-register">
          <RegisterForm />
        </div>
      </Collapse>
      <div className="authentication-modal-toggle">
        <Button size="sm" color="none" onClick={handleClick}>
          {open ? 'Hier einloggen' : 'Hier registrieren'}
        </Button>
      </div>
    </div>
  );
};
