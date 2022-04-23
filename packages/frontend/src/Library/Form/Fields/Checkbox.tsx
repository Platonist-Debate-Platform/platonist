import classNames from 'classnames';
import React, { ChangeEvent, FunctionComponent } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { FormContextValue } from '../Types';
import { InputProps } from './Input';

export interface CheckboxProps<Data> extends FormContextValue<Data> {}

type CheckboxValues<Data extends Object = {}> = {
  [key in keyof Data]: 'true' | 'false';
};

export const CheckboxBase: FunctionComponent<
  CheckboxProps<CheckboxValues> & InputProps<CheckboxValues>
> = <Data extends CheckboxValues<Data>>(
  props: CheckboxProps<Data> & InputProps<Data>,
) => {
  const { data, inputKey, setFormValue } = props;

  const formValue = data[inputKey as keyof Data];
  const inputValue = formValue.value;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;

    if (setFormValue) {
      const newFormValue = {
        ...formValue,
        value: value.toString(),
      };
      setFormValue(inputKey, newFormValue);
    }
  };

  const handleFocus = () => {
    if (setFormValue) {
      const newFormValue = {
        ...formValue,
        touched: true,
      };
      setFormValue(inputKey, newFormValue);
    }
  };

  const isValid = formValue?.pristine || formValue?.isValid ? true : false;

  return (
    <FormGroup className="form-group" check={true}>
      <Label
        className={classNames({
          'is-invalid': !isValid,
        })}
        check={true}
      >
        <Input
          className={classNames({
            'is-invalid': !isValid,
          })}
          disabled={
            props.disabled || (formValue && formValue.disabled) ? true : false
          }
          checked={
            (inputValue === 'true' && true) || (inputValue === 'false' && false)
          }
          value={inputValue ? 'true' : 'false'}
          onChange={handleChange}
          onFocus={handleFocus}
          name={formValue?.name as string}
          type="checkbox"
        />
        {formValue?.config?.title}
        {!isValid && (
          <span className="invalid-feedback">{formValue.error}</span>
        )}
      </Label>
    </FormGroup>
  );
};

export const Checkbox = withFormValue<InputProps<Object>>(CheckboxBase);
