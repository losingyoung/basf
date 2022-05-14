import request from './request';

/**
 * 注册
 */
export const signUp = (data: SignData) => {
  return request<string>('post', '/user/signup', data);
};

/**
 * 登陆
 */
export const signIn = (data: SignData) => {
  return request<string>('post', '/user/signin', data);
};

/**
 * 拉取国家信息
 */
export const getCountries = () => {
  return request<{ countries: Array<CountriesData>; favorites?: string }>(
    'get',
    '/countries/get',
  );
};

/**
 * 更新收藏信息
 */

export const updateFavorites = (favorites: string) => {
  return request('post', '/favorites/update', { favorites });
};
