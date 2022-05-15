import {query} from './db';
import * as UserModel from './user'
import * as FavoritesModel from './favorites'

export async function initDB() {
  await UserModel.createTable()
  await FavoritesModel.createTable()
  await query('show tables')
  return true;
}
