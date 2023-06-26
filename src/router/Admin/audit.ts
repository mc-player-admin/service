import { Router } from 'express'
import { query } from '../../utils/db'

const router = Router()

router.post('/get', async (req, res) => {
  const [err, result] = await query`
  select
    audits.id,
    audits.user,
    audits.name,
    audits.bili_username,
    audits.bili_uid,
    audits.screenshot,
    audits.status,
    audits.result,
    audits.date,
    users.username,
    users.qq,
    users.primary_email,
    users.register_date,
    users.primary_permission_group
  from audits
  left join users on users.id=audits.user
  where audits.status=1`
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
