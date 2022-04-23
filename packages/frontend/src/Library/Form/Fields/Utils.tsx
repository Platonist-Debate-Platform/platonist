import React from 'react';

export const disableNewlines = (event: React.KeyboardEvent<HTMLDivElement>) => {
  const keyCode = event.keyCode || event.which;

  if (keyCode === 13) {
    (event as React.KeyboardEvent<HTMLDivElement> & {returnValue: boolean}).returnValue = false;

    if (event.preventDefault) {
      event.preventDefault();
    }
  }
};

export const replaceHtml = (value: string): string => {
  return value
    .replace(/<[^>]*>?/gm, '')
    // .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<');
};