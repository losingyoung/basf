import Koa from 'koa';
import { errorLogger } from '../logger';

export function errorMiddleware() {
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
    } catch (err) {
      const errorStatus = err.status;
      if (!errorStatus) ctx.body = { errorMessage: 'Server Error. Please try again' };
      ctx.status = errorStatus || 500;
      const logMsg = `${err.stack || err} ${ctx.url} ${JSON.stringify(
        ctx.request.body
      )}`;
      // 日志记录
      errorLogger.error(logMsg);
    }
  };
}
