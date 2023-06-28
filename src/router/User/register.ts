import { Router } from 'express'
import { query } from '../../utils/db'
import { Request, User } from '../../types/express'
import { checkCode } from '../../data/codes'
import { queryOldPlayer } from '../../utils/queryOldPlayer'
import { whitelistAdd } from '../../mcsmApis/execute'

const router = Router()

/**
 * 完善用户qq、邮箱等信息
 * @param qq
 * @param code
 * @param user
 * @returns
 */
const setUserinfo = async (qq: string, code: string, user: User) => {
  // qq
  if (!/^[1-9][0-9]{4,10}$/.test(qq)) {
    return {
      status: 403,
      msg: 'qq格式不正确'
    }
  }
  // 验证码
  const mail = `${qq}@qq.com`
  if (!checkCode(mail, code)) {
    return {
      status: 403
    }
  }
  // 验证qq
  {
    const [err, result] = await query`
  select * from users where qq=${qq}
`
    if (err) {
      return { status: 500 }
    }
    if (result.length >= 1) {
      return {
        status: 403,
        msg: '该用户已存在'
      }
    }
  }
  const [err] = await query`update users set ${{
    qq,
    primary_email: mail
  }} where id=${user.id}`
  if (err) {
    return { status: 500 }
  }
  return {
    status: 200
  }
}

router.post('/new', async (req: Request, res) => {
  const { qq, code } = req.body
  const user = req.user
  res.send(await setUserinfo(qq, code, user))
})

// todo: 填写时验证qq和邮箱
router.post('/transfer/queryName', async (req: Request, res) => {
  const { qq, name } = req.body
  const player = await queryOldPlayer(qq, name, req.user.id)
  if (player.usable == false) {
    return res.send({
      status: 403,
      msg: player.msg
    })
  }
  return res.send({
    status: 200
  })
})

router.post('/transfer', async (req: Request, res) => {
  const { qq, name, code } = req.body
  const user = req.user
  const player = await queryOldPlayer(qq, name, req.user.id)
  if (player.usable == false) {
    return res.send({
      status: 403,
      msg: player.msg
    })
  }
  // 添加白名单
  const add = await whitelistAdd(name)
  if (!add) {
    return res.send({
      status: 500,
      msg: '白名单添加失败'
    })
  }
  // 完善用户信息
  const set = await setUserinfo(qq, code, user)
  if (set.status != 200) {
    return res.send(set)
  }
  // 插入玩家信息
  const [err] = await query`insert into players set ${{
    name,
    transfer_id: player.id,
    user: user.id,
    type: 1,
    status: 1
  }}`
  if (err) {
    return res.send({
      status: 403
    })
  }
  res.send({
    status: 200
  })
})

export default router
