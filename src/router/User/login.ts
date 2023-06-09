import { Router } from 'express'
import { check } from '../../utils/bcrypt'
import { query } from '../../utils/db'
import axios from 'axios'
import { getConfig } from '../../utils/config'
import { getAccessToken, getOpenId, getUserInfo } from '../../utils/qqConnectLogin'
import { OkPacket } from 'mysql2'
import { randomUUID } from 'crypto'
import token from '../../utils/token'
import type { Request } from '../../types/express'

const router = Router()

/**
 * 使用密码登录
 */
router.post('/password', async (req: Request, res) => {
  /**
   * user: 可以是 qq
   */
  const { user, password } = req.body

  if (/^[1-9][0-9]{4,10}$/.test(user)) {
    return res.send({
      status: 403
    })
  }
  const [err, result] = await query`select * from users where qq=${user};`
  if (err) {
    return res.send({ status: 500 })
  }
  if (result.length < 1) {
    return res.send({ status: 403, msg: '账号不存在' })
  }
  if (!check(password, result[0].password)) {
    return res.send({ status: 403, msg: '账号或密码错误' })
  }

  res.send({
    status: 200,
    data: {
      token: token({
        id: result[0].id
      })
    }
  })
})
// router.post('/mail', () => {

// })

/**
 * qq互联登录
 */
const { appid, appkey, redirect_uri } = await getConfig('app', 'qq_connect')
router.post('/qq/init', async (req: Request, res) => {
  const uuid = randomUUID()
  const [err, result] = await query<OkPacket>`
  insert into login_queue set ${{
    uuid,
    date: new Date(),
    status: 0,
    ip: req.ip,
    user_agent: req.headers['user-agent']
  }};
  `
  if (err) {
    return res.send({
      status: 500
    })
  }
  res.send({
    status: 200,
    data: {
      uuid,
      appid,
      redirect_uri: redirect_uri
    }
  })
})

router.post('/qq', async (req: Request, res) => {
  const { code, state } = req.body
  // 验证 state(uuid)
  {
    const [err, result] = await query`
    select * from login_queue where uuid=${state};
    `
    if (err) {
      return res.send({
        status: 500
      })
    }
    if (result.length != 1) {
      return res.send({
        status: 403
      })
    }
  }
  // 获取 openid 和 userInfo
  const { access_token } = await getAccessToken(appid, appkey, code)
  const { openid } = await getOpenId(access_token)
  const userInfo = await getUserInfo(access_token, appid, openid)

  if (!openid || userInfo.ret != 0) {
    return res.send({
      status: 403
    })
  }

  {
    const [err, result] = await query`
    select * from users where openid=${openid};
    `
    if (err) {
      return res.send({
        status: 500,
        msg: '登录失败'
      })
    }
    // 已存在 登录
    if (result.length >= 1) {
      query`
      update users set ${{
        last_login_date: new Date(),
        username: userInfo.nickname,
        avatar: userInfo.figureurl_qq_2 || userInfo.figureurl_qq_1
      }} where id=${result[0].id}
      `
      return res.send({
        status: 200,
        data: {
          type: 'login',
          token: token({
            id: result[0].id
          })
        }
      })
    }
  }
  // 新用户 注册
  {
    const [err, result] = await query<OkPacket>`insert into users set ${{
      username: userInfo.nickname,
      avatar: userInfo.figureurl_qq_2 || userInfo.figureurl_qq_1,
      openid: openid,
      status: 1,
      register_date: new Date(),
      register_ip: req.userIp,
      register_user_agent: req.headers['user-agent'],
      primary_permission_group: 0
    }}`
    if (err) {
      return res.send({
        status: 500,
        msg: '注册失败'
      })
    }
    return res.send({
      status: 200,
      data: {
        type: 'register',
        token: token({
          id: result.insertId
        })
      }
    })
  }
})

export default router
