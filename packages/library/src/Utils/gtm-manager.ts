import TagManager, { TagManagerArgs } from 'react-gtm-module';

export const initGTM = ({ isProduction }: { isProduction: boolean }) => {
  if (isProduction) {
    const tagManagerArgs: TagManagerArgs = {
      gtmId: 'GTM-TC487TQ',
    };

    setTimeout(() => {
      TagManager.initialize(tagManagerArgs);
    }, 2000);
  }
};
