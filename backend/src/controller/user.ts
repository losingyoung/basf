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
    ctx.body = { errorMessage: '用户名由字母，数字或下划线组成，50位以下' };
    return next();
  }
  // 校验密码 密码为空时的hash
  const emptyHash =
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  if (!passwordHash || emptyHash === passwordHash) {
    ctx.body = { errorMessage: '密码不能为空' };
    return next();
  }
  const ifSameUserName = await UserModel.queryUserName(userName)
  if (ifSameUserName[0].cnt > 0){
    ctx.body = {errorMessage: '用户名重复'}
    return next()
  }
  await UserModel.signup(body)
  ctx.body = {data: '注册成功'}
  // 全局状态 中间件会用到
  ctx.userName = userName
  ctx.lastLoginTime = `${+new Date()}`
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
    ctx.body = {errorMessage: '用户名不存在'}
    return next()
  }
  const userInfo = results[0]
  const {user_name, last_login_time} = userInfo
  if (userInfo.password_hash !== passwordHash){
    ctx.body = {errorMessage: '密码错误'}
    return next()
  }
  // 可以异步更新 不需要等待
  UserModel.updateLastLoginTime(new Date(), userName)
  ctx.userName = user_name
  ctx.lastLoginTime = `${last_login_time.getTime()}`
  ctx.body = {data: '登陆成功'}
  return next()
};
