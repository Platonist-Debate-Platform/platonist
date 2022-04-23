import { SocketKeys, SocketMethod } from './Keys';

export interface UseSocketProps<Data> {
  callBack?: (data: Data) => void;
  key: SocketKeys
  method: SocketMethod,
}

export type UseSocket<Data> = (props: UseSocketProps<Data>) => void;