import classNames from 'classnames';
import { BaseEmoji, Picker } from 'emoji-mart';
import React, { ChangeEvent, FunctionComponent, useCallback, useRef } from 'react';
import { FormGroup, Label } from 'reactstrap';
import { useInputValue} from '../Consumer';
import { FormDataItem } from '../Types';
import { ErrorTooltip } from '../UtilComponents';
import { InputProps } from './Input';

export interface TextProps {}

type TextValues<Data extends Object = {}> = {[key in keyof Data]: string};

export const Text: FunctionComponent<InputProps<TextValues>> = <Data extends TextValues<Data>>({
  className,
  disabled,
  hideLabel,
  inputKey
}: InputProps<Data>) => {

  const [inputValue, setInputValue, formId] = useInputValue<Data>(inputKey as keyof Data);
  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    if (setInputValue && inputValue) {
      const newFormValue: FormDataItem<Data> = {
        ...inputValue,
        value: value as any,
      };
      setInputValue(inputKey, newFormValue);
    }
  }, [inputKey, inputValue, setInputValue]);

  const handleFocus = useCallback(() => {
    if (setInputValue && inputValue) {
      const newFormValue: FormDataItem<Data> = {
        ...inputValue,
        touched: true,
      };
      setInputValue(inputKey, newFormValue);
    }
  }, [inputKey, inputValue, setInputValue]);

  const handlePickerSelect = useCallback((emojiData: BaseEmoji) => {
    if (!inputValue?.config?.usePicker) {
      return;
    }
    
    const sym = emojiData.unified.split('-');
    const codesArray: number[] = [];
    sym.forEach(el => codesArray.push(Number('0x' + el)));
    const emojiPic = String.fromCodePoint(...codesArray);
    
    if (textarea) {
      const cursorPosition = (textarea as React.MutableRefObject<HTMLTextAreaElement>).current.selectionStart || 0;
      const value = inputValue?.value || '';

      if (setInputValue && inputValue) {
        const newFormValue: FormDataItem<Data> = {
          ...inputValue,
          value: value.slice(0, cursorPosition) +  emojiPic + ' ' + value.slice(cursorPosition) as any
        };
        
        setTimeout(() => {
          (textarea as React.MutableRefObject<HTMLTextAreaElement>).current.focus();
          (textarea as React.MutableRefObject<HTMLTextAreaElement>).current.selectionEnd = cursorPosition + 2;
          (textarea as React.MutableRefObject<HTMLTextAreaElement>).current.selectionStart = cursorPosition + 2;
        }, 100);

        setInputValue(inputKey, newFormValue);
      }  
    }
  }, [inputKey, inputValue, setInputValue]);

  const isValid = inputValue?.pristine || inputValue?.isValid ? true : false;
  const name = inputValue?.name as string;

  return (
    <>
    <FormGroup className={className}>
      {!hideLabel && (
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
      {!isValid && inputValue?.error && (
        <span className="invalid-feedback">
          <ErrorTooltip
            error={inputValue?.error}
            formId={formId}
            inputKey={inputKey as string}
          />
        </span>
      )}
      <textarea
        className={classNames('form-control', {
          'is-invalid': !isValid,
        })}
        disabled={disabled || (inputValue && inputValue.disabled) ? true : false}
        name={name}
        placeholder={inputValue?.config?.placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        value={inputValue?.value || ''}
        ref={textarea}
      />
      </FormGroup>
      {inputValue?.config?.usePicker && (
        <Picker onSelect={handlePickerSelect} />
      )}
    </>
  );
}