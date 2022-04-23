import validator from 'validator';

import { FormValidationTypes } from './Keys';
import { ValidateOptions } from './Types';

export interface ValidateBaseProps {
  comparison?: string | string [];
  options?: ValidateOptions; 
  value: string;
}

export type ValidateProps = ValidateBaseProps & {
  type: FormValidationTypes,
};

export type Validate = (props: ValidateProps) => string | undefined;

export const isValidPassword = (password: string): string | undefined => {
  const stringLength = password.length >= 8;
  const countSpecialChars = (password.match(/[@#$%^&*()_+\-=[]{};':"\\|,.<>\/?]/g) || []).length >= 1;
  const countDigits = (password.match(/\d/g) || []).length >= 1;
  const countUppercaseLetters = (password.match(/[A-Z]/g) || []).length >= 1;
  const specialCharsAndDigits = countSpecialChars && countDigits;
  const digitsAndUppercaseLetters = countDigits && countUppercaseLetters;
  const uppercaseLettersAndSpecialChars = countUppercaseLetters && countSpecialChars;
  const isValidPassword = stringLength && (specialCharsAndDigits || digitsAndUppercaseLetters || uppercaseLettersAndSpecialChars);
  if (!isValidPassword) {
    return `
      will need to comply to the following rules! Minimum length of 8 characters, \n
      It must contain 2 out 3 of the following, Letters (e.g. ABCD...) - Numbers (e.g. 0123...) - Special Characters (e.g. #$%...)
    `;
  }
  return undefined;
}

export const isValidTel = (value: string): string | undefined => {
  const tel = value ? value.toString() : '';
  if (!validator.isLength(value, {min: 5})) {
    return 'Should have at least five characters.';
  }
  else {
    // tslint:disable-next-line
    const pattern = /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[-. \\/]?)?((?:\(?\d{1,}\)?[-. \\/]?){0,})(?:[-. \\/]?(?:#|ext\.?|extension|x)[-. \\/]?(\d+))?$/i;
    const isValidTel = pattern.test(tel);
    if (!isValidTel) {
      return 'Should be a valid phone number';
    }
  }
  return undefined;
}

export const validate: Validate = ({type, value, comparison, options}) => {
  switch (type) {
    case FormValidationTypes.Active:
      if (!value || !Boolean(value)) {
        return 'Should be active'
      }
      return undefined;
    case FormValidationTypes.Date:
      break;
    case FormValidationTypes.Email: 
      if (!validator.isEmail(value, options as validator.IsEmailOptions)) {
        return 'Invalid email address';
      }
      return undefined;
    case FormValidationTypes.Equal: 
      if (comparison && !validator.equals(value, comparison as string)) {
        return 'Values doesn\'t match';
      }
      return undefined;
    case FormValidationTypes.Length:
      const lengthOptions: validator.IsLengthOptions = {
        min: 2,
        ...(options as validator.IsLengthOptions || {})
      }
      if (!validator.isLength(value, lengthOptions)) {
        return `Should be longer then ${lengthOptions.min} characters.`;
      }
      return undefined;
    case FormValidationTypes.Number:
      if (!validator.isNumeric(value, options as validator.IsNumericOptions)) {
        return 'Value should be numeric'
      }
      return undefined;
    case FormValidationTypes.Password: 
      return isValidPassword(value);
    case FormValidationTypes.Phone:
      return isValidTel(value);
    case FormValidationTypes.Selected:
      if (Array.isArray(comparison) && comparison.indexOf(value) === -1) {
        return 'Value should be selected';
      }
      return undefined;
    case FormValidationTypes.Words: 
      const wordsOptions: validator.IsLengthOptions = {
        min: 3,
        ...(options as validator.IsLengthOptions || {})
      }
      const wordCount = value.split(' ').length;
      if (wordCount <= (wordsOptions.min || 3)) {
        return `Should be more then ${wordsOptions.min} words.`
      }
      if (wordsOptions.max && wordCount <= wordsOptions.max) {
        return `Shouldn't be more then ${wordsOptions.max} words.`
      }
      return undefined;
    case FormValidationTypes.Url:
      const isURLOptions: validator.IsURLOptions = {
        require_protocol: false,
        protocols: ['http', 'https'],
        ...(options || {}),
      }
      if (!validator.isURL(value, isURLOptions)) {
        return 'Please enter a valid URL'
      }
      return undefined;
    default:
      return undefined; 
  }
};