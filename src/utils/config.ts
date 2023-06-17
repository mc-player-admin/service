import localConfig from './localConfig'
import { Config } from '../types/config'
import { getPackage } from './package'
import { query } from './db'

const defaultConfig: Config = {
  app: {
    base_url: '/',
    port: 3000,
    jwt_secret_key: '123456',
    mysql: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'admin123',
      database: 'mc-player-admin'
    },
    mail: {
      host: 'localhost',
      port: 587,
      secure: false,
      auth: {
        user: 'admin',
        pass: '123456'
      }
    }
  },
  system: {
    sql_version: null,
    version: null
  }
}

export const getConfig = async <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
): Promise<Config[T][K]> => {
  /**
   * 查找顺序
   * 系统级配置 > 数据库配置 > 本地配置文件 > 默认配置
   */
  // 系统级配置 通过系统获取 无法通过配置文件修改
  if (type == 'system') {
    if (key == 'version') {
      const { version } = await getPackage()
      return version as Config[T][K]
    }
  }
  // 数据库配置
  const [err, result] = await query`
  select * from config where name=${`${type}.${key.toString()}`};
  `
  if (result.length > 0) {
    return JSON.parse(result.at(-1).value)
  }
  // 本地配置
  if (localConfig[type][key]) {
    return localConfig[type][key] as Config[T][K]
  }
  // 默认配置
  return defaultConfig[type][key]
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
        last_edit_date: new Date()
      }} where name=${configName};
      `
    if (err) {
      return false
    }
  }
  return true
}
