import {io} from 'socket.io-client';
import { createApiUrl, defaultConfig } from '../../../Library';

export const createSocket = () => {
  const config = defaultConfig();
  const url = createApiUrl(config.api.config);

  return io(url.href);
};
