import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

import {t} from '@/locales/i18n';
import useStore from '@/store/userStore';

import {toast} from 'sonner';
import type {Result} from '#/api';
import {ResultEnum} from '#/enum';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    // 在请求头中添加token
    const token = useStore.getState().userToken;
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    } else {
      config.headers!.Authorization = `Bearer Token`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (!res.data) {
      toast.error(t('sys.api.apiRequestFailed'));
    }

    const {status, data, message} = res.data;
    // 业务请求成功
    const hasSuccess =
      data && Reflect.has(res.data, 'status') && status === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }

    // 业务请求失败
    throw new Error(message || t('sys.api.apiRequestFailed'));
  },
  (error: AxiosError<Result>) => {
    const {response, message} = error || {};

    const errMsg =
      response?.data?.message || message || t('sys.api.errorMessage');
    toast.error(errMsg, {
      position: 'top-center',
    });

    const status = response?.status ?? 500;
    // 401 token过期，需要清楚用户信息和token
    if (status === 401) {
      useStore.getState().actions.clearUserInfoAndToken();
    }
    return Promise.reject(error);
  }
);

class APIClient {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({...config, method: 'GET'});
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({...config, method: 'POST'});
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({...config, method: 'PUT'});
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({...config, method: 'DELETE'});
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          reject(e);
        });
    });
  }
}

export default new APIClient();