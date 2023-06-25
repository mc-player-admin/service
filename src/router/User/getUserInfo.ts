import { Router } from 'express'
import { Request } from '../../types/express'
import { query } from '../../utils/db'
import { auth, checkUserPremission } from '../../utils/premission'

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

    /**
     * 获取权限
     */
    const premissionList = [
      'admin.audit',
      'admin.edit_userinfo',
      'admin.edit_player',
      'admin.create_user',
      'admin.create_player'
    ]
    const premissions = await Promise.all(
      premissionList.map((e) => {
        return checkUserPremission(user.id, e)
      })
    )

    res.send({
      status: 200,
      data: {
        userinfo: result[0],
        premission: premissions
          .filter((e) => e)
          .map((e, i) => {
            return {
              name: premissionList[i],
              value: e
            }
          })
      }
    })
  }
)

export default router
