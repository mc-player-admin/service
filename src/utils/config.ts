import localConfig from './localConfig'
import { Config } from '../types/config'
import { getPackage } from './package'

export const getConfig = async <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
) => {
  // 系统级配置 通过系统获取 无法通过配置文件修改
  if (type == 'system') {
    if (type == 'system' && key == 'version') {
      const { version } = await getPackage()
      return version
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
