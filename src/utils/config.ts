import localConfig from './localConfig'
import { Config } from '../types/config'

export const getConfig = async <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
) => {
  return localConfig[type][key]
}

export const getLocalConfig = <T extends keyof Config, K extends keyof Config[T]>(
  type: T,
  key: K
) => {
  return localConfig[type][key]
}
