import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { Form as FormElement } from 'reactstrap';
import { Socket } from 'socket.io-client';
import { FromKeyboardEvent } from '.';
import { useSelector } from 'react-redux';

import { FormContext } from './Context';
import { FormResolver } from './FormResolver';
import { FormContextValue, FormData, FormEvent } from './Types';
import {
  GlobalState,
  PrivateRequestKeys,
  PublicRequestKeys,
} from '@platonist/library';

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
  socket?: Socket;
}

export const Form: FunctionComponent<PropsWithChildren<FormProps>> = <
  Data extends Object,
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
  const { result: user } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.User]
  >((state) => state.user);
  const { result: debate } = useSelector<
    GlobalState,
    GlobalState[PublicRequestKeys.Debate]
  >((state) => state.debate);

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

      if (props.socket) {
        props.socket.emit('typing', {
          comment: null,
          user: user,
          debate: debate,
        });
      }
    }
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (onKeyDown && context) {
        onKeyDown<Data>({
          ...event,
          data: context.data,
          submitData: context.submitData,
        });
        if (props.socket) {
          props.socket.emit('typing', {
            comment: context.data,
            user: user,
            debate: debate,
          });
        }
      }
    },
    [props.socket, user, debate, context, onKeyDown],
  );

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
