import { render, screen } from '@testing-library/react';
import { Article } from '@platonist/library';

import { ArticleItem } from './ArticleItem';

const props: Article = {
  id: 1,
  isOffline: false,
  description: 'string',
  icon: null,
  image: null,
  key: undefined,
  keywords: 'string',
  title: 'Article Title',
  language: 'string',
  type: 'string',
  url: 'string',
  provider: 'string',
  published_at: 123,
  ratings: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('Should render an article item', () => {
  beforeEach(() => {
    render(<ArticleItem {...props} />);
  });

  test('renders the article title', () => {
    const title = screen.getByText(props.title);
    expect(title).toEqual(props.title);
  });
});
