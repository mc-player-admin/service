/**
 * sql版本控制
 * 方案：
 * 每个版本对应两条sql 升级sql 和 初始化sql
 * 如果全新安装了 1.2.3 版本 则执行 1.2.3这个版本的初始化sql
 * 如果系统从1.2.3版本更新到2.0.0版本 需要变动sql，则依次执行中间各个版本的升级sql
 */

import { getConfig } from './config'
import { getPackage } from './package'
import sqls from '../data/sql'
import { logger } from './log'
import { dbQuery, query } from './db'

const CONFIG_NAME = 'system.sql_version'

// 表是否存在
const tableExist = async () => {
  const [err, result] = await query`
   show tables like '%config%';
  `
  if (result.length != 1) {
    return false
  }
  return true
}

export const useSqlVersion = async () => {
  const version = sqls.at(-1).sqlVersion
  // const sqlVersion = await getConfig('system', 'sql_version')

  const table = await tableExist()
  let sqlVersion = -1
  if (table) {
    const [err, result] = await query`select value from config where name=${CONFIG_NAME}`
    sqlVersion = Number(result[0].value)
  }

  // 没有初始化(表不存在)
  if (!table) {
    logger.info('初始化数据库')
    const sql = sqls.at(-1).init
    let errCount = 0
    for (let i in sql) {
      logger.info(`正在执行第${Number(i) + 1}/${sql.length}`)
      const [err] = await dbQuery(sql[i])
      if (err) {
        errCount++
      }
    }
    // todo: 吧更新配置这个东西封装到config里面
    await query`
      insert into config set ${{
        name: CONFIG_NAME,
        value: sqls.at(-1).sqlVersion
      }};
    `
    sqlVersion = sqls.at(-1).sqlVersion
    logger.info(`初始化完成，失败${errCount}条`)
  }
  // 需要更新数据库
  if (version > sqlVersion) {
    logger.info('更新数据库')

    // 先找到对应版本的索引
    const index = sqls.findIndex((e) => e.sqlVersion == sqlVersion) + 1
    let errCount = 0
    // 遍历此后的语句
    for (let i = index; i < sqls.length; i++) {
      logger.info(`正在执行第${Number(i) + 1}/${sqls.length - index}组`)
      const sql = sqls[i].update
      for (let j = 0; j < sql.length; j++) {
        logger.info(
          `正在执行第${Number(i) + 1}/${sqls.length - index}组中的第${j + 1}/${
            sql.length
          }`
        )
        const [err] = await dbQuery(sql[j])
        if (err) {
          errCount++
        }
      }
    }
  }
}
