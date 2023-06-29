import { Router } from 'express'
import { query } from '../../utils/db'
import { Request } from '../../types/express'

const router = Router()

router.post('/audits', async (req: Request, res) => {
  const user = req.user
  const [err, result] = await query`
  select
    audits.*,
    users.username as approver_username,
    users.avatar as approver_avatar
  from audits
  left join users on audits.approver = users.id
  where audits.user=${user.id}`
  if (err) {
    return res.send({
      status: 500
    })
  }
  res.send({
    status: 200,
    data: result
  })
})
router.post('/players', async (req: Request, res) => {
  const user = req.user
  const [err, result] = await query`select * from players where user=${user.id}`
  if (err) {
    return res.send({
      status: 500
    })
  }
  res.send({
    status: 200,
    data: result
  })
})

export default router
