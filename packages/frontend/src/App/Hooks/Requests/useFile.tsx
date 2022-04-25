import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from 'react-use';

import {
  GlobalState,
  Image,
  PrivateRequestKeys,
  ReactReduxRequestDispatch,
  requestAction,
  RequestStatus,
  useConfig,
} from '@platonist/library';

export interface ProfileImageEditProps {
  from: string;
  image?: Image | null;
  to: string;
}

export const useFile = (props?: { pathname: string; fileName: string }) => {
  const { result, status } = useSelector<
    GlobalState,
    GlobalState[PrivateRequestKeys.File]
  >((state) => state.file);

  const prevStatus = usePrevious(status);

  const dispatch = useDispatch<ReactReduxRequestDispatch>();
  const config = useConfig();
  const url = config.api.createApiUrl(config.api.config);

  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    url.pathname = props?.pathname || '';

    if (!props) {
      return;
    }
    if (status === RequestStatus.Initial) {
      dispatch(
        requestAction.load(PrivateRequestKeys.File, {
          url: url.href,
          responseType: 'blob',
          withCredentials: true,
        }),
      );
    }
    if (status === RequestStatus.Loaded && result && !file) {
      setFile(new File([result], props.fileName));
    }
  }, [props, status, result, file, dispatch, prevStatus, config.api, url]);

  return file;
};
