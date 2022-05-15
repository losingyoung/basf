import Koa from 'koa';
import * as UserModel from '../model/user';

/**
 * 注册
 */
export const signUp = async (ctx: Koa.Context, next: Koa.Next) => {
  const body = ctx.request.body as SignParam;
  const { userName = '', passwordHash = '' } = body
  const userNameReg = /^[a-zA-Z0-9_]{1,50}$/;
  // 校验用户名
  if (!userNameReg.test(userName)) {
    ctx.body = { errorMessage: 'username should only include character, number and underline. And length should below 50' };
    return next();
  }
  // 校验密码 密码为空时的hash
  const emptyHash =
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  if (!passwordHash || emptyHash === passwordHash) {
    ctx.body = { errorMessage: 'password cannot be empty' };
    return next();
  }
  const ifSameUserName = await UserModel.queryUserName(userName)
  if (ifSameUserName[0].cnt > 0){
    ctx.body = {errorMessage: 'username already exists'}
    return next()
  }
  const lastSigninTimestamp = await UserModel.signup(body)
  ctx.body = {data: 'signup successfully'}
  // 全局状态 中间件会用到
  ctx.userName = userName
  ctx.lastSigninTime = `${lastSigninTimestamp}`
  return next()
};

/**
 * 登陆
 */
export const signIn = async (ctx: Koa.Context, next: Koa.Next) => {
  const body = ctx.request.body as SignParam;
  const { userName = '', passwordHash = '' } = body
  const results = await UserModel.signin(userName)
  if (results.length === 0){
    ctx.body = {errorMessage: 'username does not exist'}
    return next()
  }
  const userInfo = results[0]
  const {user_name, last_signin_time} = userInfo
  if (userInfo.password_hash !== passwordHash){
    ctx.body = {errorMessage: 'wrong password'}
    return next()
  }
  // 可以异步更新 不需要等待
  UserModel.updatelastSigninTime(userName)
  ctx.userName = user_name
  ctx.lastSigninTime = `${last_signin_time}`
  ctx.body = {data: 'signin successfully'}
  return next()
};
