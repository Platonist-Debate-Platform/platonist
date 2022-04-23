import classNames from "classnames";
import React, {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button, FormGroup, Label } from "reactstrap";

import { withFormValue } from "../Consumer";
import { FormContextValue } from "../Types";
import { createDefaultData } from "../Utils";
import { Group } from "./Group";
import { InputProps } from "./Input";

export interface MultipleGroupProps<Data> extends FormContextValue<Data> {}

type MultipleGroupValues<Data extends Object = {}> = {
  [key in keyof Data]: Data[];
};

type Remove<Item extends Object = {}> = (
  items: Item[],
  index: number
) => Item[];

const remove: Remove = (items, index) => {
  const newItems: typeof items = [];
  items.forEach((item, i) => {
    if (i !== index) {
      newItems.push(item);
    }
  });

  return newItems;
};

export const MultipleGroupBase: FunctionComponent<
  MultipleGroupProps<MultipleGroupValues> & InputProps<MultipleGroupValues>
> = <Data extends MultipleGroupValues<Data>>(
  props: MultipleGroupProps<Data> & InputProps<Data>
) => {
  const { data, formId, inputKey, setFormValue } = props;

  const inputValue = data[inputKey as keyof Data];
  const inputConfig = inputValue.config?.group;
  const values = inputValue.value as MultipleGroupValues[];
  const [actionType, setActionType] = useState<"add" | "remove" | undefined>(
    undefined
  );

  const handleClick = useCallback(
    (index: number) => {
      let value = values;

      if (index === -1) {
        value.push(createDefaultData(inputConfig || []));
        if (!actionType) {
          setActionType("add");
        }
      }

      if (index > -1) {
        value = remove(value, index);
        if (!actionType) {
          setActionType("remove");
        }
      }

      const defaultValue = value;

      setFormValue(inputKey, {
        ...inputValue,
        defaultValue,
        value,
      });
    },
    [actionType, inputConfig, inputKey, inputValue, setFormValue, values]
  );

  // const handleChange = useCallback((submitData: SubmitData<Data>, index: number) => {
  //   if (actionType) {
  //     setActionType(undefined);
  //     return;
  //   }

  //   values[index] = submitData.data;

  //   setFormValue(inputKey, {
  //     ...inputValue,
  //     value: values,
  //   });

  // }, []);

  const isValid =
    inputValue && (inputValue.pristine || inputValue.isValid) ? true : false;

  useEffect(() => {
    if (actionType) {
      setActionType(undefined);
    }
  }, [actionType, setActionType]);

  return (
    <FormGroup className={classNames(props.className, "form-group-multi")}>
      {!props.hideLabel && (
        <>
          <Label
            className={classNames({
              "is-invalid": !isValid,
            })}
          >
            {inputValue?.config?.title}
          </Label>{" "}
        </>
      )}

      {inputConfig &&
        values.map((value, index) => {
          return (
            <Fragment key={`multiple_group_${inputKey}_${formId}_${index}`}>
              {values.length > 1 && (
                <div className="input-group-append">
                  <Button
                    className="input-group-text"
                    color="none"
                    onClick={() => handleClick(index)}
                    role="button"
                    disabled={values.length === 1}
                  >
                    <i className="fa fa-times" />
                    {index}
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              )}
              <Group
                index={index}
                inputKey={inputKey as string}
                // onChange={(submitData) => handleChange(submitData as any, index)}
              />
            </Fragment>
          );
        })}
      {!inputValue?.disabled && (
        <div className="btn-group text-right mt-3">
          <Button
            disabled={!inputValue?.isValid}
            color="secondary"
            className="btn-sm"
            onClick={() => handleClick(-1)}
          >
            <i className="fa fa-plus" /> Add item
          </Button>
        </div>
      )}
    </FormGroup>
  );
};

export const MultipleGroup = withFormValue<InputProps<Object>>(
  MultipleGroupBase
);
