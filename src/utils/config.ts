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

export const setConfig = async <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K,
  value: Config[T][K]
) => {
  const configName = `${type}.${String(key)}`

  const [err, result] = await query`
      select * from config where name=${configName};
    `
  if (err) {
    return false
  }
  // 没有此项配置 需要新增
  if (result.length < 1) {
    const [err] = await query`
      insert into config set ${{
        name: configName,
        value: JSON.stringify(value),
        last_edit_date: Date.now()
      }}
      `
    if (err) {
      return false
    }
  } else {
    // 有此项配置 修改
    const [err] = await query`
      update config set ${{
        value: JSON.stringify(value),
        last_edit_date: Date.now()
      }} where name=${configName};
      `
    if (err) {
      return false
    }
  }
  return true
}
