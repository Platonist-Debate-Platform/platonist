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
          In order to participate you'll have to sign in. If you don't have an account you could register an account.
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
          {open ? 'Or sign in here' : 'Or sign up now'}
        </Button>
      </div>
    </div>
  );
}