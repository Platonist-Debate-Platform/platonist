import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { Form as FormElement } from 'reactstrap';
import { FromKeyboardEvent } from '.';

import { FormContext } from './Context';
import { FormResolver } from './FormResolver';
import { FormContextValue, FormData, FormEvent } from './Types';

export type OnContextChange<D> = (
  key: string,
  data: FormContextValue<D>,
) => void;
export interface FormProps<Data extends Object = {}> {
  asForm: boolean;
  className?: string;
  data?: FormData<Data>;
  inline?: boolean;
  inputKey?: string;
  onChange?: <D>(event: FormEvent<D>) => void;
  onContextChange?: <D>(key: string, data: FormContextValue<D>) => void;
  onSubmit?: <D>(event: FormEvent<D>) => void;
  onKeyDown?: <D>(event: FromKeyboardEvent<D>) => void;
}

export const Form: FunctionComponent<PropsWithChildren<FormProps>> = <
  Data extends Object
>(
  props: PropsWithChildren<FormProps<Data>>,
) => {
  const {
    asForm,
    children,
    className,
    data,
    inline,
    inputKey,
    onChange,
    onContextChange,
    onSubmit,
    onKeyDown,
  } = props;

  const context = useContext(
    FormContext as React.Context<FormContextValue<Data> | undefined>,
  );

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
    if (onChange && context) {
      onChange<Data>({
        ...event,
        data: context.data,
        submitData: context.submitData,
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit && context) {
      onSubmit<Data>({
        ...event,
        data: context.data,
        submitData: context.submitData,
      });
    }
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
    if (onKeyDown && context) {
      onKeyDown<Data>({
        ...event,
        data: context.data,
        submitData: context.submitData,
      });
    }
  }, [context, onKeyDown])

  useEffect(() => {
    if (!asForm && inputKey && onContextChange && context) {
      onContextChange(inputKey, context);
    }
  }, [asForm, context, inputKey, onContextChange]);

  let formData: FormData<Data>;
  if (!(context && context.data)) {
    console.warn('Context Provider is missing, using data from ');
    if (data) {
      formData = data;
    } else {
      console.warn('Could not render Form, data property is missing.');
      return null;
    }
  } else {
    formData = context.data;
  }

  return (
    (asForm && (
      <FormElement
        className={className}
        inline={inline}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        {(Object.keys(formData) as (keyof FormData<Data>)[]).map(
          (inputKey, index) => {
            const item = formData[inputKey];

            if (!item.shouldRender || !item.config) {
              return null;
            }

            const key = `form_${context?.formId}_${item.config.type}_${index}`;

            return (
              <FormResolver
                key={key}
                inputKey={inputKey as string}
                type={item.config.type}
                value={item.value}
              />
            );
          },
        )}
        {children}
      </FormElement>
    )) || (
      <div>
        {(Object.keys(formData) as (keyof FormData<Data>)[]).map(
          (inputKey, index) => {
            const item = formData[inputKey];

            if (!item.shouldRender || !item.config) {
              return null;
            }

            const key = `form_${context?.formId}_${item.config.type}_${index}`;

            return (
              <FormResolver
                key={key}
                inputKey={inputKey as string}
                type={item.config.type}
                value={item.value}
              />
            );
          },
        )}
        {children}
      </div>
    )
  );
};
