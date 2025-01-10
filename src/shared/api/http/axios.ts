import axios, { InternalAxiosRequestConfig } from 'axios';

import { $jwtToken } from '@pms-ui/entities/user';

import { API_URL } from '../../config';

import { AnyObject, HttpRequestOptions } from './types';

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для всех запросов
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из Effector store
    const token = $jwtToken.getState(); // Получаем текущее значение токена из стора

    // Проверяем, что запрос не на логин
    if (token && !config.url?.includes('/login')) {
      // Убедитесь, что заголовки существуют, и добавьте токен
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
      } as any; // Приводим к типу any для обхода ошибки
    }

    return config;
  },
  (error) => Promise.reject(error)
);
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
