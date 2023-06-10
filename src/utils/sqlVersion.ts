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
import { dbQuery } from './db'

export const useSqlVersion = async () => {
  const { version } = await getPackage()
  const sqlVersion = await getConfig('system', 'sql_version')
  console.log(sqlVersion)

  // 没有初始化
  if (sqlVersion == '-1') {
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
    logger.info(`初始化完成，失败${errCount}条`)
  }
}
