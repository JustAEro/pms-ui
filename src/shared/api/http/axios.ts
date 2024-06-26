import axios from 'axios';

import { API_URL } from '../../config';

import { AnyObject, HttpRequestOptions } from './types';

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const request = <T>(
  options: HttpRequestOptions,
  params?: AnyObject
): Promise<T> =>
  instance
    .request({
      url: options.url,
      method: options.method,
      data: options?.data,
      params,
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data;
    });
