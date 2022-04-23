import React from 'react';
import { render } from '@testing-library/react';
import { BaseApp } from './index';

test('renders base application without errors', () => {
  render(<BaseApp />);
});
