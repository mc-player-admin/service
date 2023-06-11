import { Router } from 'express'
import { query } from '../../utils/db'
import type { OkPacket } from 'mysql2'

const router = Router()

router.post('/new', async (req, res) => {
  const { qq, username, code, password } = req.body
  // todo 验证码验证逻辑(通过qq号@qq.com验证qq)
  // qq
  if (!/^[1-9][0-9]{4,10}$/.test(qq)) {
    return res.send({
      status: 403,
      msg: 'qq格式不正确'
    })
  }
  // 验证qq
  {
    const [err, result] = await query`
    select * from users where qq=${qq}
  `
    if (err) {
      return res.send({ status: 500 })
    }
    if (result.length >= 1) {
      return res.send({
        status: 403,
        msg: '该用户已存在'
      })
    }
  }
  const [err, result] = await query<OkPacket>`insert into users set ${{
    username,
    password,
    qq,
    primary_email: `${qq}@qq.com`,
    status: 1,
    register_date: new Date(),
    // todo: 中间件获取/格式化ip
    register_ip: '127.0.0.1',
    register_user_agent: req.headers['user-agent'],
    // todo: 权限组
    primary_premission_group: 0
  }}`
  if (err) {
    return res.send({ status: 500 })
  }
  res.send({
    status: 200,
    data: {
      id: result.insertId
    }
  })
})

export default router
