import { isArray, isObject } from 'lodash';

import { FormInputTypes } from './Keys';
import {
  CreateInitialFormDataProps,
  FormData,
  FormDataConfig,
  FormDataItem,
  HandleValidationFn,
  PrepareValidationValuesFn,
  SubmitData,
  ValidateValue,
} from './Types';
import { validate } from './Validate';

export const createInitialFormData = <Data extends Object>(
  props: CreateInitialFormDataProps<Data>,
) => {
  const { data, inputConfig, preValidate } = props;

  const formData: FormData<Data> | {} = {};

  inputConfig.forEach((config) => {
    const key = config.key;
    const value =
      (config.type === FormInputTypes.Number ||
        config.type === FormInputTypes.Checkbox) &&
      data[key]
        ? (data[key] as any).toString()
        : data[key];
    const comparison = config?.comparison as unknown;

    let isValid: boolean = true;
    let error: string | string[] | undefined = undefined;

    const shouldPreValidate = preValidate || config?.preValidate ? true : false;

    if (shouldPreValidate && config?.validate) {
      error = validateValues({
        comparison: comparison as string | string[],
        group: config?.group,
        options: config?.validateOptions,
        types: config?.validate,
        value: value as ValidateValue,
      });

      if (isArray(error)) {
        isValid = error.some((err) => err && err.length === 0);
      } else {
        isValid = error || error?.length ? false : true;
      }
    }

    const formDataItem: FormDataItem<Data> = {
      config,
      defaultValue: value as FormDataItem<Data>['value'],
      disabled: !config?.editable ? true : false,
      error,
      isValid,
      name: key,
      pristine: true,
      shouldRender: config ? true : false,
      touched: false,
      value: value as FormDataItem<Data>['value'],
    };

    Object.assign(formData, {
      [key as keyof Data]: formDataItem,
    });
  });

  return formData as FormData<Data>;
};

export const getSubmitData = <Data extends Object>(
  formData: FormData<Data>,
  defaultData: Data,
): SubmitData<Data> => {
  const formDataAsArray = Object.keys(formData).map(
    (key) => formData[key as keyof FormData<Data>],
  );

  const newData: Data | {} = {};

  formDataAsArray.forEach((data) =>
    Object.assign(newData, {
      [data.name]:
        typeof data === 'boolean'
          ? (data as any).value
          : data.value || data.defaultValue || '',
    }),
  );

  return {
    data: newData as Data,
    isValid: !formDataAsArray.some((data) =>
      data.config?.required ? !data.isValid : false,
    ),
    pristine: !formDataAsArray.some((data) => !data.pristine),
    touched: formDataAsArray.some((data) => data.touched),
  };
};

export const handleValidation: HandleValidationFn = ({
  comparison,
  options,
  types,
  value,
}) => {
  let isValid: string | string[] | undefined = undefined;

  if (types) {
    if (isArray(types)) {
      types.forEach((type) => {
        const validation = handleValidation({
          comparison,
          options,
          types,
          value,
        });

        if (validation?.length) {
          isValid = (isArray(isValid) && isValid) || [];
          isValid.push(validation as string);
        }
      });
    } else {
      isValid = validate({
        comparison,
        options,
        type: types,
        value,
      });
    }
  }
  return isValid;
};

export const validateValues: PrepareValidationValuesFn = ({
  comparison,
  group,
  types,
  value,
  options,
}) => {
  value = value === null || value === undefined ? '' : value;

  if (typeof value === 'boolean' || typeof value === 'string') {
    return handleValidation({
      comparison,
      types,
      value: value.toString(),
      options,
    });
  } else if (!isArray(value) && isObject(value) && group) {
    const validation = Object.keys(value).map((key) => {
      const v = (value as any)[key as string];
      const g = group.find((gr) => gr.key === key);

      if (g && v) {
        return (
          validateValues({
            comparison: g.comparison,
            group: g.group,
            types: g.validate,
            value: v || '',
            options: g.validateOptions,
          }) || ''
        );
      }

      return undefined;
    });

    const isValid = validation.filter((val) => val !== '') as string | string[];

    if (isValid && isValid.length === 0) {
      return '';
    }
    return isValid || '';
  } else if (isArray(value)) {
    if (!value.length) {
      return 'Should contain Values';
    }

    const isValid: string | string[] = [];

    value.forEach((v) => {
      const validation =
        !isArray(v) && isObject(v)
          ? validateValues({
              comparison,
              group,
              types,
              value: v,
              options,
            })
          : handleValidation({
              comparison,
              types,
              value: v,
              options,
            });

      if (validation && typeof validation === 'string') {
        isValid.push(validation);
      } else if (isArray(validation)) {
        isValid.push(...validation);
      } else {
        isValid.push('');
      }
    });

    return isValid.filter((val) => val !== '');
  }

  return undefined;
};

export const createDefaultData = <Data extends Object = {}>(
  data: FormDataConfig<Data>[],
): Data => {
  const newData: Data | {} = {};

  data.forEach((d) => {
    switch (d.type) {
      case FormInputTypes.Date:
        Object.assign(newData, {
          [d.key]: new Date(),
        });
        break;
      case FormInputTypes.Checkbox:
        Object.assign(newData, {
          [d.key]: 'false',
        });
        break;
      case FormInputTypes.List:
      case FormInputTypes.Multiple:
        Object.assign(newData, {
          [d.key]: [],
        });
        break;
      case FormInputTypes.MultipleGroup:
        Object.assign(newData, {
          [d.key]: (d.group && [createDefaultData(d.group)]) || [],
        });
        break;
      case FormInputTypes.Group:
        Object.assign(newData, {
          [d.key]: (d.group && createDefaultData(d.group)) || {},
        });
        break;
      default:
        Object.assign(newData, {
          [d.key]: '',
        });
    }
  });

  return newData as Data;
};

export const getDefaultDataFromResult = <Data extends Object = {}>(
  data: Data,
  config: FormDataConfig<Data>[],
): Data => {
  const newData: Data | {} = {};
  Object.keys(data).forEach((key) => {
    const findKey = config.find((conf) => conf.key === key);
    if (findKey) {
      Object.assign(newData, {
        [key]: data[key as keyof Data],
      });
    }
  });

  return newData as Data;
};
