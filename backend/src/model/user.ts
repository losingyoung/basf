import { query } from './db';

const tableName = 'user';
export const createTable = async () => {
  await query(`CREATE TABLE IF NOT EXISTS ${tableName}(
    id bigint not null auto_increment comment '自增id',
    user_name VARCHAR(50) comment '用户名',
    password_hash VARCHAR(128) comment '用户密码hash',
    create_at bigint comment '创建时间戳',
    last_signin_time bigint comment '上次访问时间戳',
    primary key (id),
    UNIQUE KEY(user_name)
  )engine=innodb default charset=utf8mb4 comment '用户表';`);
};
/**
 * 注册
 */
export const signup = async (data: SignParam) => {
  const { userName, passwordHash } = data;
  const timestamp = +new Date();
  const values = [userName, passwordHash, timestamp, timestamp];
  await query(
    `INSERT INTO ${tableName} (user_name, password_hash, create_at, last_signin_time) VALUES (?, ?, ?, ?)`,
    values
  );
  return timestamp;
};
/**
 * 检查用户名是否重复
 */
export const queryUserName = async (userName: string) => {
  return await query<{ cnt: number }[]>(
    `SELECT count(*) as cnt from ${tableName} where user_name=?`,
    [userName]
  );
};
/**
 * 登陆
 * 返回用户名是否存在&答案是否正确
 */
export const signin = async (userName: string) => {
  return await query<Array<UserModel>>(
    `SELECT * from ${tableName} where user_name = ?`,
    [userName]
  );
};

/**
 * 更新登陆时间
 */

export const updatelastSigninTime = async (userName: string) => {
  return await query(
    `UPDATE ${tableName} set last_signin_time=? where user_name = ?`,
    [+new Date(), userName]
  );
};
