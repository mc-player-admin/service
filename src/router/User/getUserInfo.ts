import { Router } from 'express'
import { Request } from '../../types/express'
import { query } from '../../utils/db'
import { auth } from '../../utils/premission'

const router = Router()

router.post(
  '/',
  auth({
    user: {
      query_status: true
    }
  }),
  async (req: Request, res) => {
    const user = req.user
    const [err, result] = await query`
  select
    id,
    username,
    qq,
    primary_email,
    status,
    register_date,
    last_login_date,
    primary_premission_group
  from users
  where id=${user.id}
  `
    if (err) {
      return res.send({
        status: 500
      })
    }
    if (result.length != 1) {
      return res.send({
        status: 403
      })
    }
    res.send({
      status: 200,
      data: result[0]
    })
  }
)

export default router
