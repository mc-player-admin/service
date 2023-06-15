import { Router } from 'express'
import { check } from '../../utils/bcrypt'
import { query } from '../../utils/db'

const router = Router()

console.log(check('123', '456'))

/**
 * 使用密码登录
 */
router.post('/password', async (req, res) => {
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
      // todo: token
    }
  })
})
// router.post('/mail', () => {

// })
// router.post('/qq', () => {

// })

export default router
