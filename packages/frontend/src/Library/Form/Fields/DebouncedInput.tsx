import { debounce } from 'lodash';
import React, {
  ChangeEvent,
  Component,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';

export interface DebouncedInputProps extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange'> {
  onChange?: (value: DebouncedInputProps['value']) => void;
  timeout?: number;
}

export interface DebouncedInputState {
  value: DebouncedInputProps['value'];
}

export class DebouncedInput extends Component<DebouncedInputProps, DebouncedInputState> {
  constructor(props: DebouncedInputProps) {
    super(props);
    this.state = {
      value: props.value || '',
    };
  }

  componentDidMount () {
    this.onChange = debounce(this.onChange, this.props.timeout || 500);
  }

  componentDidUpdate (prevProps: DebouncedInputProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({value: this.props.value});
    }
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      value,
    });
    this.onChange(value);
  }

  onChange = (value: DebouncedInputProps['value']) => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  render () {
    const {
      onChange,
      value,
      ...rest
    } = this.props;

    return (
      <input
        onChange={this.handleChange}
        value={this.state.value}
        {...rest}
      />
    );
  }
}