import jwt from 'jsonwebtoken'
import { getConfig } from './config'
import { User } from '../types/express'

const jwtSecretKey = await getConfig('app', 'jwt_secret_key')

export default (data: User) => {
  // 需要在客户端拼接 Bearer 的前缀
  return jwt.sign(data, jwtSecretKey, {
    // expiresIn: '10h' // token 有效期为 10 个小时
    // 这里单位是秒 不是毫秒！
    // 直接用 10d 表示10天
    expiresIn: '10d'
  })
}
