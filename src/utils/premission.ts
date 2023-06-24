import { Premission } from '../types/premission'
import type { RequestHandler } from 'express'
import { logger } from './log'

/**
 * 将两级的类型转换为可选
 */
type PartialSub<T> = {
  [k in keyof T]?: {
    [sub in keyof T[k]]?: T[k][sub]
  }
}

/**
 * express中间件
 * 验证权限
 */
export const auth = (premission: PartialSub<Premission>): RequestHandler => {
  return (req, res, next) => {
    // todo: 鉴权
    logger.info(`[${req.path}] 鉴权 ${JSON.stringify(premission)}`)
    next()
  }
}
