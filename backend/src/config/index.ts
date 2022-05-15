import prod from './prod'

const local = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'basf'
  },
  signinSessionKey: 'localtestkey'
}
const config = process.env.NODE_ENV === 'production' ? prod : local

export default config