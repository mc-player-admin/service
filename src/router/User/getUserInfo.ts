import { Router } from 'express'
import { Request } from '../../types/express'
import { query } from '../../utils/db'
import { auth, checkUserPermission } from '../../utils/permission'

const router = Router()

router.post('/', auth('user', 'query_status'), async (req: Request, res) => {
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
    primary_permission_group
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
  const permissionList = [
    'admin.audit',
    'admin.edit_userinfo',
    'admin.edit_player',
    'admin.create_user',
    'admin.create_player',
    'admin.edit_permission'
  ]
  const permissions = await Promise.all(
    permissionList.map((e) => {
      return checkUserPermission(user.id, e)
    })
  )

  res.send({
    status: 200,
    data: {
      userinfo: result[0],
      permission: permissions
        .map((e, i) => {
          return {
            name: permissionList[i],
            value: e
          }
        })
        .filter((e) => e.value)
    }
  })
})

export default router
