import './Form.scss';

import { isEqual, isObject } from 'lodash';
import { Comment, randomHash } from '@platonist/library';
import { Component, ReactNode } from 'react';

import { FormContext } from './Context';
import { Form } from './Form';
import {
  FormContextValue,
  FormData,
  FormDataConfig,
  FormOptions,
} from './Types';
import { createInitialFormData, getSubmitData, validateValues } from './Utils';

export interface FormProviderProps<Data extends Object = {}> {
  children?: ReactNode;
  data: Data;
  id?: Comment['id'];
  inputConfig: FormDataConfig<Data>[];
  isProtected?: boolean;
  onChange?: (data: FormContextValue<any>) => void;
  preValidate?: boolean;
  reset?: boolean;
  name?: string;
}

export class FormProvider<Data extends Object = {}> extends Component<
  FormProviderProps<Data>,
  FormContextValue<Data>
> {
  constructor(props: FormProviderProps<Data>) {
    super(props);
    const { data, inputConfig, isProtected, preValidate, reset } = props;

    const options: FormOptions = {
      isProtected: isProtected ? true : false,
      preValidate: preValidate === undefined ? true : preValidate,
    };

    this.setFormValue = this.setFormValue.bind(this);
    const formData = createInitialFormData<Data>({
      data,
      inputConfig,
      isProtected: options.isProtected,
      preValidate: options.preValidate,
    });

    this.state = {
      data: formData,
      formId: props.id || randomHash(24),
      options,
      reset: reset || false,
      setFormValue: this.setFormValue,
      submitData: getSubmitData(formData, data),
    };
  }

  public setFormValue(
    key: keyof Data | string,
    formValue: FormData<Data>[keyof FormData<Data>],
    comparison?: string | string[],
  ): void {
    const { submitData } = this.state;

    if (isEqual(submitData.data, formValue.value)) {
      return;
    }

    const formData = this.state.data;

    if ((key as keyof Data) in formData) {
      const error =
        formValue.config &&
        validateValues({
          comparison:
            comparison || (formValue.config.comparison as string | undefined),
          group: formValue.config?.group,
          types: formValue.config.validate,
          value: formValue.value as never,
          options: formValue.config.validateOptions,
        });

      let isValid = false;
      if (Array.isArray(error) && error.length) {
        isValid = error
          .filter((err) => err !== undefined || err === '')
          .some((err) => err && err.length === 0);
      } else if (Array.isArray(error) && !error.length) {
        isValid = true;
      } else {
        isValid = error || error?.length ? false : true;
      }

      let pristine = true;

      if (Array.isArray(formValue.value)) {
        pristine =
          Array.isArray(formValue.value) &&
          Array.isArray(formValue.defaultValue) &&
          isEqual(formValue.value, formValue.defaultValue);
      } else if (!Array.isArray(formValue.value) && isObject(formValue.value)) {
        pristine = isEqual(formValue.value, formValue.defaultValue);
      } else {
        pristine = formValue.value === formValue.defaultValue;
      }

      const newFormValue: FormData<Data>[keyof Data] = {
        ...formValue,
        error,
        isValid,
        pristine,
      };

      const newFormData = Object.assign(formData, {
        [key]: newFormValue,
      });

      const data = {
        data: newFormData,
        submitData: getSubmitData(newFormData, this.props.data),
      };

      this.setState(data);

      if (this.props.onChange) {
        this.props.onChange({
          ...this.state,
          ...data,
        });
      }
    }
  }

  componentDidUpdate(prevProps: FormProviderProps<Data>) {
    const { data, inputConfig, isProtected, preValidate, reset } = this.props;

    if (this.state.reset) {
      this.setState({ reset: false });
    }

    if (!this.state.reset && reset && !prevProps.reset) {
      const options: FormOptions = {
        isProtected: isProtected ? true : false,
        preValidate: preValidate === undefined ? true : preValidate,
      };

      const formData = createInitialFormData<Data>({
        data,
        inputConfig,
        isProtected: options.isProtected,
        preValidate: options.preValidate,
      });

      const newData = {
        data: formData,
        reset: true,
        submitData: getSubmitData(formData, data),
      };

      this.setState(newData);

      if (this.props.onChange) {
        this.props.onChange({
          ...this.state,
          ...newData,
        });
      }
    }
  }

  render() {
    const value = this.state as FormContextValue<Data>;

    return (
      <FormContext.Provider value={value}>
        {this.props.children ? (
          <>{this.props.children}</>
        ) : (
          <Form asForm={true} />
        )}
      </FormContext.Provider>
    );
  }
}
