import { useEffect, useState } from 'react';
import { Debate, randomHash } from '@platonist/library';
import { SocketKeys, SocketMethod } from './Keys';
import { useSocket } from './useSocket';

export interface UseDebateSocketMeta {
  createTime: number;
  hash: string;
  method?: SocketMethod;
  updateTime: number;
}

const setMetaDefaults = () => ({
  createTime: Date.now(),
  method: undefined,
  hash: randomHash(32),
  updateTime: Date.now(),
});

export const useDebateSocket = (): [
  Debate | undefined,
  UseDebateSocketMeta,
  () => void,
] => {
  const [create, createTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Create,
  });

  const [update, updateTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Update,
  });

  const [remove, removeTime] = useSocket<Debate>({
    key: SocketKeys.Debate,
    method: SocketMethod.Delete,
  });

  const [data, setData] = useState(create || update);
  const [meta, setMeta] = useState<UseDebateSocketMeta>(setMetaDefaults());

  const clear = () => {
    setData(undefined);
    setMeta(setMetaDefaults());
  };

  useEffect(() => {
    const newMeta: UseDebateSocketMeta = {
      createTime,
      hash: randomHash(32),
      updateTime,
    };

    if (createTime > updateTime && create?.updated_at !== data?.updated_at) {
      setData(create);
      newMeta.method = SocketMethod.Create;
    }
    if (updateTime > createTime && update?.updated_at !== data?.updated_at) {
      setData(update);
      newMeta.method = SocketMethod.Update;
    }
    if (removeTime > createTime && remove?.updated_at !== data?.updated_at) {
      setData(remove);
      newMeta.method = SocketMethod.Delete;
    }

    setMeta(newMeta);
  }, [
    create,
    createTime,
    data?.updated_at,
    remove,
    removeTime,
    update,
    updateTime,
  ]);

  return [data, meta, clear];
};
