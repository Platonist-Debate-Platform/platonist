import { io } from 'socket.io-client';
import { createApiUrl, defaultConfig } from '@platonist/library';

export const createSocket = () => {
  const config = defaultConfig();
  const url = createApiUrl(config.api.config);

  return io(url.href);
};
