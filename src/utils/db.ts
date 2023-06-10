import mysql, { QueryError, FieldPacket } from 'mysql2'
import config from './localConfig'
import { logger } from './log'

const { host, user, password, database, port } = config.app.mysql

logger.info(`连接数据库 ${host}:${port} ${user} ${database}`)
export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  charset: 'UTF8MB4_GENERAL_CI'
})

export const dbQuery = <T = any>(
  sql: string,
  data?: any
): Promise<[QueryError, T, FieldPacket[]]> => {
  return new Promise((resolve) => {
    // const sql = strings.join('?')
    db.query(sql, data, (err, result, fields) => {
      if (err) {
        logger.error('数据库报错', err)
      }
      resolve([err, result as T, fields])
    })
  })
}

export const query = <T = any>(strings: TemplateStringsArray, ...data: any) => {
  const sql = strings.join('?')
  return dbQuery<T>(sql, data)
  // return new Promise((resolve) => {
  //   const sql = strings.join('?')
  //   db.query(sql, data, (err, result, fields) => {
  //     if (err) {
  //       logger.error('数据库报错', err)
  //     }
  //     resolve([err, result as T, fields])
  //   })
  // })
}
