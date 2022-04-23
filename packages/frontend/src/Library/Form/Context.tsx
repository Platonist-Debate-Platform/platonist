import React from 'react';

import { FormContextValue } from './Types';

export const FormContext = React.createContext<
  FormContextValue<any> | undefined
>(undefined);
