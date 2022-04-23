import { isEqual } from 'lodash';
import React, { FunctionComponent, useCallback } from 'react';
import { FormGroup } from 'reactstrap';

import { withFormValue } from '../Consumer';
import { Form } from '../Form';
import { FormInputTypes } from '../Keys';
import { FormProvider } from '../Provider';
import { FormContextValue, SubmitData } from '../Types';
import { InputProps } from './Input';

export interface GroupBaseProps<Data> {
  index?: number;
  onChange?: (data: SubmitData<Data>, index: number) => void;
  setReset?: boolean;
}

export type GroupProps<Data> = GroupBaseProps<Data> & FormContextValue<Data>;

type GroupValues<Data extends Object = {}> = {
  [key in keyof Data]: Data | Data[];
};

export const GroupBase: FunctionComponent<
  GroupProps<GroupValues> & InputProps<GroupValues>
> = <Data extends GroupValues<Data>>(
  props: GroupProps<Data> & InputProps<Data>,
) => {
  const { data, inputKey, reset, setFormValue } = props;

  const inputValue = data[inputKey as keyof Data];

  const { value, config, defaultValue } = inputValue;

  const handleContextChange = useCallback(
    (key: string, context: FormContextValue<Data>) => {
      const { submitData } = context;
      const shouldSetFormValue = !isEqual(value, submitData.data);

      if (
        inputValue.config?.type === FormInputTypes.Group &&
        shouldSetFormValue
      ) {
        setFormValue(key as keyof Data, {
          ...inputValue,
          isValid: submitData.isValid,
          touched: true,
          value: submitData.data,
        });
      }
    },
    [inputValue, setFormValue, value],
  );

  return (
    <FormGroup className={props.className}>
      {config?.group && (
        <FormProvider
          {...props.options}
          data={reset ? defaultValue : value}
          inputConfig={config.group}
          reset={reset}
          name={inputKey as string}
        >
          <Form
            asForm={false}
            inputKey={inputKey as string}
            onContextChange={(key, context) =>
              handleContextChange(key, context as any)
            }
          />
        </FormProvider>
      )}
    </FormGroup>
  );
};

export const Group = withFormValue<InputProps<Object> & GroupBaseProps<Object>>(
  GroupBase,
);
