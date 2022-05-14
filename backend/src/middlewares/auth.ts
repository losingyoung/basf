import Koa from 'koa';
import { AES, enc } from 'crypto-js';
import config from '../config';
/**
 * 检查权限的中间件
 * 1. 检查/api前缀的请求 不检查/api/user前缀的请求
 * 2. 把cookie中的user_name取出来放到ctx
 * 3. 执行业务逻辑
 * 4. 更新cookie和user model的时间
 */
const maxAge = 1000 * 60 * 15;
export function authMiddleware() {
  return async function (ctx: Koa.Context, next: Koa.Next) {
    const pathname = ctx.path;
    // 静态文件请求 不检查
    if (!/\/api/.test(pathname)) {
      return next();
    }
    const cookieKey = 'signin_session';
    const cookie = ctx.cookies.get(cookieKey);
    const sessionData = decryptCookie(cookie);
    if (
      (!cookie || !validSession(sessionData, ctx)) &&
      !/\/api\/user/.test(pathname)
    ) {
      ctx.throw(403, 'forbidden');
    }
    const { userName, lastSigninTime } = sessionData;
    // 已登陆则有值 方便后续next的接口中调用
    ctx.userName = userName;
    ctx.lastSigninTime = lastSigninTime

    // 进行登陆/注册过程
    await next();

    // 如果有了 说明已登陆/登陆成功/刚注册
    if (ctx.userName) {
      const newSession = encryptCookie({
        userName: ctx.userName,
        // visit time每次访问会延长 sign time只是登陆的那一次的时间
        lastVisitTime: +new Date(),
        lastSigninTime: ctx.lastSigninTime,
        userAgent: ctx.headers['user-agent'],
        ip: ctx.ip,
      });
      ctx.cookies.set(cookieKey, newSession, { sameSite: 'strict', maxAge, httpOnly: false });
      ctx.cookies.set('user_name', ctx.userName, { sameSite: 'strict', maxAge, httpOnly: false });
      ctx.cookies.set('last_signin_time', ctx.lastSigninTime, { sameSite: 'strict', maxAge, httpOnly: false });
    }
  };
}

function decryptCookie(cookie: string): Partial<SessionData> {
  try {
    const dataStr = AES.decrypt(cookie, config.signinSessionKey).toString(
      enc.Utf8
    );
    return JSON.parse(dataStr);
  } catch (error) {
    return {};
  }
}
/**
 * 检测session是否有效，同ip，ua，有效期内
 */
function validSession(data: Partial<SessionData>, ctx: Koa.Context) {
  const { userAgent, ip, lastVisitTime } = data;
  if (
    +new Date() - lastVisitTime > maxAge ||
    userAgent !== ctx.headers['user-agent'] ||
    ip !== ctx.ip
  ) {
    return false;
  }
  return true;
}
function encryptCookie(data: SessionData) {
  return AES.encrypt(JSON.stringify(data), config.signinSessionKey).toString();
}
