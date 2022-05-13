import Koa from "koa";
// 全局错误捕获中间件，日志上报在unionRes
export function errorMiddleware() {
  return async function (ctx: Koa.Context, next: Koa.Next) {
    try {
      await next();
    } catch (err) {
      console.log(err)
      const errorStatus = err.status
      if (!errorStatus)ctx.body = { errorMessage: '服务器运行错误，请重试' };
      ctx.status = errorStatus || 500;
    }
  };
}
