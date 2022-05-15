import mysql from 'mysql'
import config from '../config'

const {db: dbConfig} = config
const pool  = mysql.createPool({
  connectionLimit : 100,
  host            : dbConfig.host,
  user            : dbConfig.user,
  password        : dbConfig.password,
  port            : dbConfig.port,
  database        : dbConfig.database
});

export async function query<T>(sql: string, values?: Array<any>): Promise<T> {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, function (error, results) {
      if (error) return reject(error);
      resolve(results)
    })
  })
}
