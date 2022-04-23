import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { Agent } from 'https';
import {
  isStaging,
  isProduction,
} from 'platonist-library/build/Config/DefaultConfig';

const isDevelopment = !(isProduction || isStaging) ? true : false;
const axiosInstance = isDevelopment
  ? axios.create({
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
    })
  : axios;

export const http = <Payload extends Object>(config: AxiosRequestConfig) =>
  axiosInstance(config) as AxiosPromise<Payload>;
