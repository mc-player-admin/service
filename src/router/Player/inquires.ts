import { Router } from 'express'
import { query } from '../../utils/db'
import type { Inquires } from '../../types/express'

const router = Router()
router.post('/', async (req: Inquires, res) => {
  if (!req.body || !req.body.parameter) {
    return res.send({
      status: 400,
      msg: '必须提供查询参数parameter'
    })
  }
  const parameter = `%${req.body.parameter}%`
  const [err, result] = await query`
  select name,qq,register_date,type,users.status
  from players
  left join users on users.id = players.user
  where name like ${parameter} or qq like ${parameter}
  `
  if (err) {
    return res.send({
      status: 500,
      msg: '服务器错误'
    })
  }
  res.send({
    status: 200,
    msg: '查询成功',
    data: result
  })
})

export default router
