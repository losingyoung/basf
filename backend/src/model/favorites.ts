import { query } from './db';

const tableName = 'favorites';
export const createTable = async () => {
  await query(`CREATE TABLE IF NOT EXISTS ${tableName}(
    id bigint not null auto_increment comment '自增id',
    user_name VARCHAR(50) comment '用户名',
    favorites TEXT comment 'favorites列表逗号分隔',
    primary key (id),
    UNIQUE KEY(user_name)
  )engine=innodb default charset=utf8mb4 comment '用户收藏表';`);
};
/**
 *  查询收藏列表
 */
export const queryFavorites = async (userName: string) => {
  return await query<Array<{favorites: string}>>(`SELECT favorites from ${tableName} where user_name=?`, [userName])
}

/**
 * 更新/新增favorites
 */
export const updateUserFavorites = async (userName: string, favorites: string) => {
  await query(
    `INSERT INTO ${tableName} (user_name, favorites) VALUES (?, ?) ON DUPLICATE KEY UPDATE favorites=?`,
    [userName, favorites, favorites]
  );
};
