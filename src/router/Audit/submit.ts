import { Router } from 'express'
import { queryOldPlayer } from '../../utils/queryOldPlayer'
import type { Request } from '../../types/express'
import { query } from '../../utils/db'
import dayjs from 'dayjs'
import { OkPacket } from 'mysql2'
import { getConfig } from '../../utils/config'

const router = Router()

router.post('/checkName', async (req: Request, res) => {
  const { name } = req.body
  const player = await checkAudit(req.user.id, name)
  if (player.usable == false) {
    return res.send({
      status: 403,
      msg: player.msg
    })
  }
  res.send({ status: 200 })
})

const checkAudit = async (
  user: number,
  name?: string,
  biliUsername?: string,
  biliUid?: string
): Promise<{
  usable: boolean
  msg?: string
  status?: number
}> => {
  // 是否完善信息
  {
    const [err, result] = await query`
    select * from users where id=${user}
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (!result[0].qq || !result[0].primary_email) {
      return {
        usable: false,
        msg: '请先完善信息',
        status: 4031
      }
    }
  }
  // 有正在审核的
  {
    const [err, result] = await query`
    select * from audits where user=${user} and status=1
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '您已申请白名单，请等待审核'
      }
    }
  }
  // 是否已有白名单
  {
    const [err, result] = await query`
    select * from players where user=${user}
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '您已申请白名单，无法再次申请'
      }
    }
  }
  // 是否只检测是否已经申请
  if (!name) {
    return {
      usable: true
    }
  }
  // 未审核的 同名的
  {
    const [err, result] = await query`
      select * from audits where name=${name} and status=1
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '该id已申请白名单'
      }
    }
  }
  // 是否检测bili信息
  if (!biliUsername) {
    return {
      usable: true
    }
  }
  // bili信息重复 (排除审核未通过的)
  {
    const [err, result] = await query`
    select * from audits where
      (bili_uid=${biliUid} and status!=2) or 
      (bili_username=${biliUsername} and status!=2)
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '信息已被使用'
      }
    }
  }
  return {
    usable: true
  }
}

/**
 * 初始化 用于验证是否可提交和交换配置项
 */
const { host } = await getConfig('app', 'cos')
router.post('/init', async (req: Request, res) => {
  const user = req.user
  const check = await checkAudit(user.id)
  if (check.usable == false) {
    return res.send({
      status: check.status || 403,
      msg: check.msg
    })
  }
  res.send({
    status: 200,
    data: {
      host
    }
  })
})

router.post('/', async (req: Request, res) => {
  const { name, biliUsername, biliUid, screenshot } = req.body
  const user = req.user
  if (
    !/^([a-zA-Z])([a-zA-Z0-9 ]{1,14})$/.test(name) ||
    !/^.{1,20}$/.test(biliUsername) ||
    !/^[1-9][0-9]{0,19}$/.test(biliUid) ||
    !screenshot
  ) {
    return res.send({
      status: 403
    })
  }
  const [err, result] = await query<
    {
      qq: string
    }[]
  >`
  select
    *
  from users
  where id=${user.id}
  `
  if (err || result.length < 1) {
    return res.send({
      status: 403
    })
  }

  const userinfo = result[0]

  if (!userinfo.qq) {
    return res.send({
      status: 4031,
      msg: '请先绑定QQ'
    })
  }

  const check = await checkAudit(user.id, name, biliUsername, biliUid)
  if (check.usable == false) {
    return res.send({
      status: 403,
      msg: check.msg
    })
  }
  // 提交
  {
    const random = Math.floor(Math.random() * 100000)

    const [err, result] = await query<OkPacket>`
    insert into audits set ${{
      id: dayjs().format(`YYYYMMDD${random}`),
      user: user.id,
      name,
      bili_username: biliUsername,
      bili_uid: biliUid,
      screenshot,
      status: 1,
      date: new Date()
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
        insertId: result.insertId
      }
    })
  }
})

export default router
