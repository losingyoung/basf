import axios from 'axios';
import { message } from 'antd';
// 支持请求失败后自动重试
import axiosRetry from 'axios-retry';

const http = axios.create({
  timeout: 20000,
  baseURL: '/api',
});

axiosRetry(http, { retries: 3 });

/**
 * http request 拦截器
 */
http.interceptors.request.use(
  (config) => config,
  (error) => {
    message.error(`请求发送失败：${error}`);
    Promise.reject(error);
  },
);

/**
 * http response 拦截器
 */
http.interceptors.response.use(
  (response) => {
    const { code, errorMessage } = response.data;
    if (code !== 0) {
      message.error(errorMessage);
      return Promise.reject(response.data);
    }
    return response.data.data;
  },
  (error) => {
    message.error(`服务器错误：${error}`);
    return Promise.reject(error);
  },
);

export default function <T>(type: 'get' | 'post', url: string, data?: object) {
  if (type === 'post') {
    return http.post<T, T>(url, data);
  }
  return http.get<T, T>(url, { params: data });
}
