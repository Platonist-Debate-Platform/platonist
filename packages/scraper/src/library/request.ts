import { AxiosResponse } from 'axios';
import { QueryParameter } from 'platonist-library';
import {
  apiConfig,
  createApiUrl,
} from 'platonist-library/build/Config/DefaultConfig';
import { stringify } from 'qs';

import { http } from './http';

export const request = async <Model>(
  pathname: string,
  query?: QueryParameter,
) => {
  const api = createApiUrl(apiConfig);
  api.pathname = pathname;
  api.search = (query && stringify(query)) || '';

  let result: AxiosResponse<Model>;
  try {
    result = await http<Model>({
      url: api.href,
    });
  } catch (error) {
    throw error;
  }

  return result.data;
};
