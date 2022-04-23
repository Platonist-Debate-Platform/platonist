import classNames from 'classnames';
import React, { FunctionComponent } from 'react';
import { FormGroup, Label, Button, InputGroup } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { FormContextValue } from '../Types';
import { InputProps } from './Input';

export interface MultipleInputProps<Data> extends FormContextValue<Data> {}

type MultipleInputValues<Data extends Object = {}> = {[key in keyof Data]: string[]};

export const MultipleInputBase: FunctionComponent<MultipleInputProps<MultipleInputValues> & InputProps<MultipleInputValues>> = <Data extends MultipleInputValues<Data>>(
    props: MultipleInputProps<Data> & InputProps<Data>
) => {
  
  const {
    data,
    setFormValue,
  } = props;
  
  const inputValue = data[props.inputKey as keyof Data];
  const values = !(inputValue && inputValue.value) || ((inputValue.value.length === 0) && (inputValue.value && !inputValue.value[0])) ? [''] : inputValue.value;
  const last = values[values.length - 1];
  const disabled = last.length === 0 || (values.length === 1 && last.length === 0);

  const handleChange = (value: string, index: number) => {
    const newValues = values;
    newValues[index] = value;
    const newInputValue = {
      ...inputValue,
      value: newValues
    };
    setFormValue(props.inputKey, newInputValue);
  };

  const handleFocus = () => {
    if (!inputValue.touched) {
      const newInputValue = {
        ...inputValue,
        touched: true,
      };
      setFormValue(props.inputKey, newInputValue);
    }
  };

  const handleClick = (action: 'add' | 'remove', index: number) => {
    
    if (action === 'add' && !disabled) {
      values.push('');
    }

    if (action === 'remove' && index > -1) {
      values.splice(index, 1);
    }

    const newInputValue = {
      ...inputValue,
      value: values
    };
    setFormValue(props.inputKey, newInputValue);
  }

  const isValid = inputValue && (inputValue.pristine || inputValue.isValid) ? true : false;
  const name = inputValue?.name as string;

  return (
    <FormGroup className={props.className}>
      {!props.hideLabel && (
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
      {values.map((value, index) => {
        const hasError = !inputValue?.pristine && inputValue?.error && inputValue?.error[index] ? true : false;
        return (
            <InputGroup 
              className={classNames({
                'mt-3': index > 0,
              })}
              key={`input_multiple_${props.inputKey}_${index}`}
            >
              <input
                className={classNames('form-control', {
                  'is-invalid': hasError,
                })}
                disabled={props.disabled || inputValue?.disabled ? true : false}
                value={value}
                onChange={(event) => handleChange(event.target.value, index)}
                onFocus={() => handleFocus}
                name={name}
              />
              {values.length > 0 && (
                <div className="input-group-append">
                  <div 
                    className="input-group-text"
                    color="none"
                    onClick={() => handleClick('remove', index)}
                    role="button"
                  >
                    <i className="fa fa-times" />
                    <span className="sr-only">
                      Remove item
                    </span>
                  </div>
                </div>
              )}
            </InputGroup>
        );
      })}
      
      {!inputValue?.disabled && (
        <div className="text-right mt-3">
          <Button
            disabled={!inputValue?.isValid || disabled}
            color="secondary"
            className="btn-sm"
            onClick={() => handleClick('add', -1)}
          >
            <i className="fa fa-plus" /> Add item
          </Button>
        </div>
      )}
    </FormGroup>
  );
}

export const MultipleInput = withFormValue<InputProps<Object>>(MultipleInputBase);
