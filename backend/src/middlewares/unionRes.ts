import Koa from 'koa';
// import { errorLogger } from "../utils/logger";
export function unionResMiddleware() {
  return async function (ctx: Koa.Context, next: Koa.Next) {
    await next();
    // 没有body 返回404
    if (!ctx.body && !ctx.status) {
      ctx.status = 404;
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          ctx.type = 'html';
          ctx.body = '<p>Not Found >_< </p>';
          break;
        case 'json':
          ctx.body = {
            errorMessage: 'Not Found',
          };
          break;
        default:
          ctx.type = 'text';
          ctx.body = 'Not Found';
      }
      return;
    }
    // 按照约定， ctx body 成功为 {data: any} 失败为{errorMessage}
    if (Object.prototype.toString.call(ctx.body) === '[object Object]') {
      if ((ctx.body as { data: any }).data) {
        Object.assign(ctx.body, {
          code: 0,
        });
      }
      if ((ctx.body as { errorMessage: string }).errorMessage) {
        Object.assign(ctx.body, {
          code: 1,
        });
      }
    }
  };
}
