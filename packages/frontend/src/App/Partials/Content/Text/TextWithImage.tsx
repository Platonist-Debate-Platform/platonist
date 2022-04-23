import React from 'react';

import {
  MediaPosition,
  TextWithImage as TextWithImageProps,
} from '@platonist/library';
import { TextWithImageBottom } from './TextWithImageBottom';
import { TextWithImageLeft } from './TextWithImageLeft';
import { TextWithImageRight } from './TextWithImageRight';
import { TextWithImageTop } from './TextWithImageTop';

export const TextWithImage: React.FC<
  TextWithImageProps & { forJobs?: boolean }
> = (props) => {
  if (!props.active) {
    return null;
  }

  switch (props.mediaPosition) {
    case MediaPosition.Top:
      return <TextWithImageTop {...props} />;
    case MediaPosition.Right:
      return <TextWithImageRight {...props} />;
    case MediaPosition.Bottom:
      return <TextWithImageBottom {...props} />;
    case MediaPosition.Left:
      return <TextWithImageLeft {...props} />;
    default:
      return null;
  }
};
