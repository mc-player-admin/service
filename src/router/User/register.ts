import { Router } from 'express'
import { query } from '../../utils/db'
import { Request } from '../../types/express'
import { codes } from '../../data/codes'

const router = Router()

router.post('/new', async (req: Request, res) => {
  const { qq, code } = req.body
  const user = req.user
  // todo 验证码验证逻辑(通过qq号@qq.com验证qq)
  // qq
  if (!/^[1-9][0-9]{4,10}$/.test(qq)) {
    return res.send({
      status: 403,
      msg: 'qq格式不正确'
    })
  }
  // 验证码
  const mail = `${qq}@qq.com`
  if (
    !codes.find((e) => {
      return mail == e.mail && e.code == code && e.date + 1000 * 60 * 10 > Date.now()
    })
  ) {
    return res.send({ status: 403 })
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
  const [err] = await query`update users set ${{
    qq,
    primary_email: mail
  }} where id=${user.id}`
  if (err) {
    return res.send({ status: 500 })
  }
  res.send({
    status: 200
  })
})

export default router
