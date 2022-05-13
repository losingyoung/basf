import { query } from './db';
import * as uuid from 'uuid';
const tableName = 'user';
export const createTable = async () => {
  await query(`CREATE TABLE IF NOT EXISTS ${tableName}(
    id bigint not null auto_increment comment '自增id',
    user_name VARCHAR(50) comment '用户名',
    password_hash VARCHAR(128) comment '用户密码hash',
    create_at datetime not null default CURRENT_TIMESTAMP comment '创建时间',
    last_login_time datetime not null default CURRENT_TIMESTAMP comment '上次访问时间',
    primary key (id),
    UNIQUE KEY(user_name)
  )engine=innodb default charset=utf8mb4 comment '用户表';`);
};
/**
 * 注册
 */
export const signup = async (data: SignParam) => {
  const { userName, passwordHash } = data;
  const values = [userName, passwordHash];
  await query(
    `INSERT INTO ${tableName} (user_name, password_hash) VALUES (?, ?)`,
    values
  );
  return true
};
/**
 * 检查用户名是否重复
 */
export const queryUserName = async (
  userName: string
)=> {
  return await query<{cnt: number}[]>(
    `SELECT count(*) as cnt from ${tableName} where user_name=?`,
    [userName]
  );
};
/**
 * 登陆
 * 返回用户名是否存在&答案是否正确
 */
export const signin = async (userName: string) => {
  return await query<Array<UserModel>>(`SELECT * from ${tableName} where user_name = ?`, [userName])
}

/**
 * 更新登陆时间
 */

export const updateLastLoginTime = async (time: Date, userName: string) => {
  return await query(`UPDATE ${tableName} set last_login_time=? where user_name = ?`, [time, userName])
}