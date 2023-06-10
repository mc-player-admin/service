import localConfig from './localConfig'
import { Config } from '../types/config'
import { getPackage } from './package'
import { query } from './db'

export const getConfig = async <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
) => {
  // 系统级配置 通过系统获取 无法通过配置文件修改
  if (type == 'system') {
    if (key == 'version') {
      const { version } = await getPackage()
      return version
    }
    if (key == 'sql_version') {
      // 表是否存在
      const [err, result] = await query`
        show tables like '%config%';
      `
      // console.log(result)

      if (result.length != 1) {
        return '-1'
      }
    }
    return null
  }
  return localConfig[type][key]
}

export const getLocalConfig = <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
) => {
  return localConfig[type][key]
}
