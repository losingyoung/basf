import Koa from 'koa';
import * as FavoritesModel from '../model/favorites';

/**
 * 查询
 */
 export const query = async (userName: string) => {
   const favorites = await FavoritesModel.queryFavorites(userName)
   const data = favorites[0]
   return data && data.favorites || ''
 }

 /**
  * 更新
  */
export const update = async (ctx: Koa.Context, next: Koa.Next) => {
  const {favorites} = ctx.request.body
  try {
    await FavoritesModel.updateUserFavorites(ctx.userName, favorites)
    ctx.body = {data: 'success'}
  } catch (error) {
    ctx.body = {errorMessage: '收藏失败'}
  }

  return next()
}
