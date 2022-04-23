import { useEffect, useState } from 'react';

import { createSocket } from './createSocket';
import { SocketKeys, SocketMethod } from './Keys';
import { UseSocketProps } from './Types';

const socket = createSocket();

const createSocketName = (key: SocketKeys, method: SocketMethod) => `${key}.${method}`;

export function useSocket <Data>({
  callBack,
  key,
  method
}: UseSocketProps<Data>): [Data | undefined, number] {
  
  const [data, setData] = useState<Data | undefined>(undefined);
  const [time, setTime] = useState(Date.now())
  const socketName = createSocketName(key, method);

  useEffect(() => {
    socket.on(socketName, (result: Data) => {
      setData(result);
      const now = Date.now();
      if (now !== time) {
        setTime(Date.now())
      }
      if (callBack) {
        callBack(result);
      }
    });
    return () => {
      socket.off(socketName);
    }
  }, [callBack, socketName, data, setData, key, time]);

  return [data, time];
};
