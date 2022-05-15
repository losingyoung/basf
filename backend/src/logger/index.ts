import path from 'path'
import fse from 'fs-extra'
import log4js from 'log4js'

const loggerPath = path.resolve(__dirname, '../../logs')
fse.ensureDirSync(loggerPath)

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    error: {type: "dateFile", filename: path.resolve(loggerPath, 'error/error.log'), numBackups: 3},
    access: { type: 'dateFile', filename: path.resolve(loggerPath, 'info/info.log'), numBackups: 3},
  },
  categories: {
    default: { appenders: [ 'out', 'access' ], level: 'debug' },
    access: {appenders: ["out", "access"], level: "info"},
    error: {appenders: ["out", "error"], level: "error"}
  }
});
export const errorLogger = log4js.getLogger("error")
export const accessLogger = log4js.getLogger("info")

