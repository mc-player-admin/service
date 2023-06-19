import { Router } from 'express'
import { createCode } from '../../data/codes'

const router = Router()

/**
 * 获取邮箱验证码
 */
router.post('/mail', async (req, res) => {
  const { mail: qq } = req.body
  if (!/^[1-9][0-9]{4,10}$/.test(qq)) {
    return res.send({
      status: 403
    })
  }
  const mail = qq + '@qq.com'
  if (!(await createCode(mail))) {
    return res.send({
      status: 403
    })
  }
  res.send({
    status: 200
  })
})

export default router
