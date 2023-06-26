import type { permission } from '../types/permission'
import type { Request } from '../types/express'
import type { RequestHandler } from 'express'
import { logger } from './log'
import { query } from './db'

/**
 * 将两级的类型转换为可选
 */
type PartialSub<T> = {
  [k in keyof T]?: {
    [sub in keyof T[k]]?: T[k][sub]
  }
}

/**
 * 默认权限
 * 不区分是否登录 账号权限
 */
const defaultpermission: permission = {
  visitor: {
    register: true,
    login: true,
    query_player: true
  },
  user: {
    submit: true,
    transfer: true,
    upload: true,
    query_status: true
  },
  admin: {
    audit: false,
    edit_userinfo: false,
    edit_player: false,
    create_user: false,
    create_player: false,
    edit_permission: false
  }
}

/**
 * express中间件
 * 验证权限
 */
export const auth = (permission: PartialSub<permission>): RequestHandler => {
  return async (req: Request, res, next) => {
    const user = req.user
    // 两层循环确认权限
    for (let i in permission) {
      for (let j in permission[i as keyof typeof permission]) {
        const name = `${i}.${j}`
        const havepermission = await checkUserpermission(user.id, name)
        if (!havepermission) {
          return res.send({
            status: 403,
            msg: '权限不足'
          })
        }
      }
    }
    logger.info(`[${req.path}] [${req.user.id}] 鉴权 ${JSON.stringify(permission)} 通过`)
    next()
  }
}

/**
 * 验证用户权限
 */
export const checkUserpermission = async (user: number, name: string) => {
  const [err, result] = await query<
    {
      value: boolean | null | 0 | 1
    }[]
  >`
  select * from users
  left join permission_group on 
      primary_permission_group = permission_group.group and
      permission_group.name=${name}
  where users.id=${user}
  `
  if (err || result[0].value == 0) {
    logger.info(`[${user}] 鉴权 ${name} 拒绝`)
    return false
  }
  // 数据库没有约定权限
  const nameKey = name.split('.')
  // @ts-ignore
  if (result[0].value == null && !defaultpermission[nameKey[0]][nameKey[1]]) {
    logger.info(` [${user}] 鉴权  ${name} 匹配默认权限拒绝`)
    return false
  }
  return true
}
