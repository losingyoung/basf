import Router from '@koa/router';
import user from './user';
import favorites from './favorites';
import countries from './countries'

export const router = new Router();

router.get('/ping', async(ctx, next) => {
  ctx.body='pong'
  next()
})


router.use('/user', user.routes());
router.use('/favorites', favorites.routes());
router.use('/countries', countries.routes());

