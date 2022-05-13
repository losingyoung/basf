import Router from '@koa/router';
import user from './user';

export const router = new Router();

router.get('/ping', async(ctx, next) => {
  ctx.body='pong'
  next()
})

router.use('/user', user.routes());

