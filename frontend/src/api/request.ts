import axios from 'axios';
import { message } from 'antd';
// 支持请求失败后自动重试
import axiosRetry from 'axios-retry';

const http = axios.create({
  timeout: 30000,
  baseURL: '/api',
});

axiosRetry(http, { retries: 3 });
let hide: () => void;
function showLoading() {
  hide = message.loading('loading', 0);
}
function hideLoading() {
  hide();
}

/**
 * http request 拦截器
 */
http.interceptors.request.use(
  (config) => {
    showLoading();
    return config;
  },
  (error) => {
    hideLoading()
    message.error(`请求发送失败：${error}`);
    Promise.reject(error);
  },
);

/**
 * http response 拦截器
 */
http.interceptors.response.use(
  (response) => {
    hideLoading()
    const { code, errorMessage } = response.data;
    if (code !== 0) {
      message.error(errorMessage);
      return Promise.reject(response.data);
    }
    return response.data.data;
  },
  (error) => {
    hideLoading()
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
