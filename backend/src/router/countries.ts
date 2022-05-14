import Koa from 'koa';
import Router from '@koa/router';
import axios from 'axios';
import * as FavoritesService from '../controller/favorites';
const router = new Router();

let lastPull = 0;
let cache: Array<{ [index: string]: string | number }> = [];
router.get('/get', async (ctx: Koa.Context, next: Koa.Next) => {
  const cur = +new Date();
  let favorites;
  try {
    favorites = await FavoritesService.query(ctx.userName);
  } catch (error) {
    //
  }

  if (cur - lastPull > 43200000 || cache.length === 0) {
    const { data } = await axios.get('https://restcountries.com/v3/all');
    lastPull = +new Date();
    cache = data;
    ctx.body = { data: {
      countries: data,
      favorites
    } };
    return next();
  }
  ctx.body = { data: {
    countries: cache,
    favorites
  } };
  return next();
});

export default router;
