import mysql, { QueryError, FieldPacket } from 'mysql2'
import { getLocalConfig } from './config'
import { logger } from './log'

const { host, user, password, database, port } = getLocalConfig('app', 'mysql')

logger.info(`连接数据库 ${host}:${port} ${user} ${database}`)
export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  charset: 'UTF8MB4_GENERAL_CI'
})

export const query = <T = any>(
  strings: TemplateStringsArray,
  ...data: any
): Promise<[QueryError, T, FieldPacket[]]> => {
  return new Promise((resolve) => {
    const sql = strings.join('?')
    db.query(sql, data, (err, result, fields) => {
      if (err) {
        logger.error('数据库报错', err)
      }
      resolve([err, result as T, fields])
    })
  })
}
