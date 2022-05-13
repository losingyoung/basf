import {query} from './db';
import * as UserModel from './user'

export async function initDB() {
  await UserModel.createTable()
  await query('show tables')
  return true;
}
