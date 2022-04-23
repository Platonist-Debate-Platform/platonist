import React, { FunctionComponent } from 'react';

import { Checkbox, DateInput, Group, Input, MultipleInput, Select, Text } from './Fields';
import { MultipleGroup } from './Fields/MultipleGroup';
import { FormInputTypes } from './Keys';

export interface FormResolverProps {
  inputKey: string;
  type: FormInputTypes;
  value: any;
}

export const FormResolver: FunctionComponent<FormResolverProps> = ({
  inputKey,
  type,
  value,
}) => {
  switch (type) {
    case FormInputTypes.Checkbox: 
      return (
        <Checkbox inputKey={inputKey as string} />
      );
    case FormInputTypes.Date:
      return (
        <DateInput inputKey={inputKey as string} />
      );
    case FormInputTypes.Multiple:
      return (
        <MultipleInput inputKey={inputKey as string} />
      );
    case FormInputTypes.Email:
    case FormInputTypes.Number:
    case FormInputTypes.Password:
    case FormInputTypes.String:
      return (
        <Input inputKey={inputKey as string} />
      );
    case FormInputTypes.Select:
      return (
        <Select inputKey={inputKey as string} />
      );
    case FormInputTypes.Group:
      return (
        <Group inputKey={inputKey as string} />
      );
    case FormInputTypes.MultipleGroup:
      return (
        <MultipleGroup inputKey={inputKey as string}/>
      );
    case FormInputTypes.Text: 
      return (
        <Text inputKey={inputKey as string}/>
      );
    case FormInputTypes.Static:
    default:
      return (
        <React.Fragment>
          {value}
        </React.Fragment>
      );
  }
};