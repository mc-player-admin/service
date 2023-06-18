import { Router } from 'express'
import { sendMail } from '../../utils/mail'
import { getConfig } from '../../utils/config'
import { codes } from '../../data/codes'

const router = Router()

/**
 * 获取邮箱验证码
 */
const { emial_code } = await getConfig('app', 'template')
router.post('/mail', async (req, res) => {
  const { mail: qq } = req.body
  if (!/^[1-9][0-9]{4,10}$/.test(qq)) {
    return res.send({
      status: 403
    })
  }
  const mail = qq + '@qq.com'
  // 查找没有超过60秒的
  const last = codes.find((e) => {
    return e.mail == mail && e.date + 1000 * 60 > Date.now()
  })
  if (last) {
    return res.send({
      status: 403
    })
  }

  const code = (Math.floor(Math.random() * 100000) + 100000).toString()
  await sendMail({
    to: mail,
    html: emial_code.template.replace('{{code}}', code),
    subject: emial_code.subject,
    from: emial_code.from
  })
  codes.push({
    code,
    mail,
    date: Date.now()
  })
  res.send({
    status: 200
  })
})

export default router
