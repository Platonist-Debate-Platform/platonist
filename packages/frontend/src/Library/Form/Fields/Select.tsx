import classNames from 'classnames';
import React, { FunctionComponent, useState } from 'react';
import { FormGroup, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { FormContextValue } from '../Types';
import { InputProps } from './Input';

export interface SelectProps<Data> extends FormContextValue<Data> {}

type SelectValues<Data extends Object = {}> = {[key in keyof Data]: string};

export const SelectBase: FunctionComponent<SelectProps<SelectValues> & InputProps<SelectValues>> = <Data extends SelectValues<Data>>(
    props: SelectProps<Data> & InputProps<Data>
) => {
  
  const {
    data,
    formId,
    inputKey,
    setFormValue,
  } = props;

  const inputValue = data[props.inputKey as keyof Data];
  const selectValues = (inputValue && inputValue.config?.selectValues) || [];
  const selected = inputValue && inputValue.value;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const toggle = () => setDropdownOpen(prevState => {
    if (!inputValue.touched) {
      const newInputValue = {
        ...inputValue,
        touched: true,
      };
      setFormValue(inputKey, newInputValue, selectValues);
    }
    return !prevState;
  });

  const handleClick = (index: number) => {
    const value = selectValues[index];
    if (value !== selected) {
      const newInputValue = {
        ...inputValue,
        value,
      };
      setFormValue(inputKey, newInputValue, selectValues);
    }
  };

  const isValid = inputValue.pristine || inputValue.isValid ? true : false;

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
      {!isValid && (
        <span className="invalid-feedback">
          {inputValue.error}
        </span>
      )}
      <div className="input-group">
        <div
          className={classNames('form-control', {
            'is-invalid': !isValid,
          })}
        >
          {selected}
        </div>

        <Dropdown className="input-group-append" isOpen={dropdownOpen} toggle={toggle} group={true}>
          <DropdownToggle caret={false} color={'none'} className="btn btn-outline-secondary">
            Select
          </DropdownToggle>
          <DropdownMenu right={true}>
            {selectValues.map((value, index) => {
              return (
                <DropdownItem 
                  key={`office_location_select_${formId}_${inputKey}_${index}`}
                  onClick={() => handleClick(index)}
                >
                  {value}
                </DropdownItem>
              )}
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </FormGroup>
  );
}

export const Select = withFormValue<InputProps<Object>>(SelectBase);
