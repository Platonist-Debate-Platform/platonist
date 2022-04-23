import React, { FunctionComponent } from 'react';
import { Button, ButtonProps } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { FormClickEvent, FormContextValue, FormData } from '../Types';

export interface SubmitButtonProps<Data> extends FormContextValue<Data> {
  className?: string;
  onClick?: <D>(event: FormClickEvent<D>) => void;
  preventDefault?: boolean;
  checkPristine?: boolean;
}

type SubmitButtonValues<Data extends Object = {}> = {
  [key in keyof Data]: FormData<Data>[keyof Data];
};

export const SubmitButtonBase: FunctionComponent<
  SubmitButtonProps<SubmitButtonValues> & ButtonProps
> = <Data extends SubmitButtonValues<Data>>(
  props: SubmitButtonProps<Data> & ButtonProps,
) => {
  const {
    children,
    checkPristine,
    data,
    disabled,
    formId,
    options,
    preventDefault,
    setFormValue,
    submitData,
    onClick,
    reset,
    ...rest
  } = props;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event && event.preventDefault && preventDefault) {
      event.preventDefault();
    }

    if (onClick) {
      onClick({
        ...event,
        data,
        submitData,
      });
    }
  };

  const isDisabled =
    !submitData.isValid || submitData.pristine || props.disabled;

  return (
    <Button
      color="none"
      type="submit"
      {...rest}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export const SubmitButton = withFormValue<ButtonProps>(SubmitButtonBase);
