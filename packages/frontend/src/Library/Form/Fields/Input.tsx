import classNames from 'classnames';
import React, { FunctionComponent, ChangeEvent, useContext, Context } from 'react';
import { FormGroup, Label } from 'reactstrap';

import { FormContext } from '../Context';
import { FormInputTypes, FormValidationTypes } from '../Keys';
import { FormContextValue } from '../Types';
import { ErrorTooltip } from '../UtilComponents';

export interface InputProps<Data extends Object> {
  className?: string;
  disabled?: boolean;
  inputKey: keyof Data | string;
  hideLabel?: boolean;
}

export const Input: FunctionComponent<InputProps<Object>> = <Data extends Object>({
  className,
  disabled,
  hideLabel,
  inputKey,
}: InputProps<Data>) => {

  const {
    data,
    formId,
    setFormValue,
    submitData,
  } = useContext<FormContextValue<Data>>(FormContext as Context<FormContextValue<Data>>);

  const inputValue = data && data[inputKey as keyof Data];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

    const value = event.target.value;
    const compareKey = inputValue.config?.compareKey;
    const comparison = (
      inputValue.config?.validate === FormValidationTypes.Equal && compareKey && submitData.data[compareKey]
    ) || undefined;

    if (inputValue) {
      const newFormValue = {
        ...inputValue,
        value,
      };

      setFormValue(inputKey, newFormValue, comparison as any);
    }
  };

  const handleFocus = () => {
    if (inputValue) {
      const newFormValue = {
        ...inputValue,
        touched: true,
      };

      setFormValue(inputKey, newFormValue);
    }
  };

  const isValid = inputValue?.pristine || inputValue?.isValid ? true : false;
  const name = inputValue?.name as string;

  return (
    <FormGroup className={className}>
      {!hideLabel && (
        <>
          <Label
            className={classNames({
              'is-invalid': !isValid,
            })}
          >
            {inputValue?.config?.title}
          </Label>
          {' '}
        </>
      )}
      {!isValid && inputValue?.error && (
        <span className="invalid-feedback">
          <ErrorTooltip
            error={inputValue?.error}
            formId={formId}
            inputKey={inputKey as string}
          />
        </span>
      )}
      <input
        autoComplete={inputValue?.config?.autocomplete}
        className={classNames('form-control', {
          'is-invalid': !isValid,
        })}
        disabled={disabled || (inputValue && inputValue.disabled) ? true : false}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder={inputValue?.config?.placeholder}
        type={inputValue?.config?.type === FormInputTypes.Number ? FormInputTypes.Number : (inputValue?.config?.type || 'text')}
        value={(inputValue && inputValue.value) as any || ''}
      />
    </FormGroup>
  );
}