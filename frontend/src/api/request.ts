import axios from 'axios';
import { message } from 'antd';
// 支持请求失败后自动重试
import axiosRetry from 'axios-retry';
import { history } from 'umi';

const http = axios.create({
  timeout: 30000,
  baseURL: '/api',
});

axiosRetry(http, { retries: 3 });
let hide: null | (() => void);
function showLoading() {
  if (hide) return;
  hide = message.loading('loading', 0);
}
function hideLoading() {
  if (!hide) return
  hide();
  hide = null
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
    hideLoading();
    message.error(`Request sending error：${error}`);
    Promise.reject(error);
  },
);

/**
 * http response 拦截器
 */
http.interceptors.response.use(
  (response) => {
    hideLoading();
    const { code, errorMessage } = response.data;
    if (code !== 0) {
      message.error(errorMessage);
      return Promise.reject(response.data);
    }
    return response.data.data;
  },
  (error) => {
    hideLoading();
    if (error.response.status === 403) {
      history.push('/signin');
      return;
    }
    message.error(`Server Error：${error}`);
    return Promise.reject(error);
  },
);

export default function <T>(type: 'get' | 'post', url: string, data?: object) {
  if (type === 'post') {
    return http.post<T, T>(url, data);
  }
  return http.get<T, T>(url, { params: data });
}
