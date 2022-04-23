import React from 'react';
import { ReactDatePickerProps } from 'react-datepicker';
import validator from 'validator';

import { AutocompleteKeys, FormInputTypes, FormValidationTypes } from './Keys';
import { ValidateBaseProps } from './Validate';

export interface FormEvent<Data> extends React.FormEvent<HTMLFormElement> {
  data: FormData<Data>;
  submitData: SubmitData<Data>;
}

export interface FromKeyboardEvent<Data> extends React.KeyboardEvent<HTMLFormElement> {
  data: FormData<Data>;
  submitData: SubmitData<Data>;
}

export interface FormClickEvent<Data>
  extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
  data: FormData<Data>;
  submitData: SubmitData<Data>;
}

export type SubmitFn<Data> = (
  event: FormClickEvent<Data> | FormEvent<Data>,
) => void;

export type SetFormValue<Data> = (
  key: keyof Data,
  value: FormData<Data>[keyof FormData<Data>],
) => void;

export interface SubmitData<Data> {
  data: Data;
  isValid: boolean;
  pristine: boolean;
  touched: boolean;
}

export type SetFormValueFn<Data> = (
  key: keyof Data | string,
  value: FormData<Data>[keyof FormData<Data>],
  comparison?: string | string[],
) => void;

export interface FormContextValue<Data> {
  data: FormData<Data>;
  formId: string;
  options: FormOptions;
  reset: boolean;
  setFormValue: SetFormValueFn<Data>;
  submitData: SubmitData<Data>;
  // validateFormValue: (key: keyof Data, value: FormData<Data>[keyof FormData<Data>]) => void;
}

export type ValidateOptions =
  | validator.IsLengthOptions
  | validator.IsEmailOptions
  | validator.IsNumericOptions;

export interface FormDataConfig<Data> {
  autocomplete?: AutocompleteKeys;
  compareKey?: keyof Data;
  comparison?: Data[keyof Data];
  datePickerSettings?: Partial<ReactDatePickerProps>;
  editable: boolean;
  group?: FormDataConfig<any>[];
  key: keyof Data;
  placeholder?: string;
  preValidate?: boolean;
  required: boolean;
  selectValues?: string[];
  title: string;
  type: FormInputTypes;
  usePicker?: boolean;
  validate?: FormValidationTypes | FormValidationTypes[];
  validateOptions?: ValidateOptions;
}

export interface FormDataItem<Data> {
  config?: FormDataConfig<Data>;
  defaultValue: Data[keyof Data];
  disabled: boolean;
  error: string | string[] | undefined;
  isValid: boolean;
  name: keyof Data;
  pristine: boolean;
  shouldRender: boolean;
  touched: boolean;
  value: Data[keyof Data];
}

export type FormData<Data> = { [key in keyof Data]: FormDataItem<Data> };

export interface FormOptions {
  isProtected: boolean;
  preValidate: boolean;
}

export type KeyOfFormData<Data> = keyof FormData<Data>;

export type UseFormValue = <Data extends Object>(
  key: KeyOfFormData<Data>,
) => [FormData<Data>[KeyOfFormData<Data>] | undefined, SetFormValue<Data>];

export interface CreateInitialFormDataProps<Data> {
  data: Data;
  inputConfig: FormDataConfig<Data>[];
  isProtected: boolean;
  preValidate: boolean;
}

export type CreateInitialFormData<Data extends Object = {}> = (
  props: CreateInitialFormDataProps<Data>,
) => FormData<Data>;

export type ValidateValue = string | string[] | boolean;

export type HandleValidationProps = {
  comparison?: string | string[];
  options?: ValidateBaseProps['options'];
  types: FormValidationTypes | FormValidationTypes[] | undefined;
  value: string;
};

export type HandleValidationFn = (
  props: HandleValidationProps,
) => string | string[] | undefined;

export type PrepareValidationValuesProps = {
  comparison?: string | string[];
  options?: ValidateBaseProps['options'];
  group?: FormDataConfig<any>[];
  types: FormValidationTypes | FormValidationTypes[] | undefined;
  value: ValidateValue;
};

export type PrepareValidationValuesFn = (
  props: PrepareValidationValuesProps,
) => string | string[] | undefined;
