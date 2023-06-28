import { Router } from 'express'
import type { Request } from '../../types/express'
import { query } from '../../utils/db'
import { getConfig } from '../../utils/config'
import { whitelistAdd } from '../../mcsmApis/execute'

const router = Router()

const getList = () => {
  return query`
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
}

router.post('/get', async (req, res) => {
  const [err, result] = await getList()
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

const { command_add } = await getConfig('app', 'mcsm')
router.post('/set', async (req: Request, res) => {
  const user = req.user
  const { id, approved, cause } = req.body

  if (!approved && !cause) {
    return res.send({
      status: 403,
      msg: '请填写原因'
    })
  }

  // 查询
  const [err, result] = await query<
    {
      id: string
      user: number
      name: string
      bili_username: string
      bili_uid: string
      screenshot: string
      status: number
      result?: any
      cause?: any
      approver?: any
      date: string
    }[]
  >`select * from audits where id=${id} and status=1`
  if (err) {
    return res.send({
      status: 500
    })
  }
  if (result.length < 1) {
    return res.send({
      status: 403,
      msg: '未找到id'
    })
  }
  const audit = result[0]

  // 添加白名单
  if (approved) {
    const add = await whitelistAdd(audit.name)
    if (!add) {
      return res.send({
        status: 500,
        msg: '白名单添加失败'
      })
    }
  }
  // 修改审核表
  {
    const [err] = await query`update audits set ${{
      status: 2,
      result: approved ? 1 : 2,
      cause,
      approver: user.id
    }} where id=${id}`

    if (err) {
      return res.send({
        status: 500
      })
    }
  }
  // 添加玩家
  {
    if (approved) {
      query`insert into players set ${{
        name: audit.name,
        user: audit.user,
        type: 1,
        status: 1
      }}`
    }
  }
  res.send({
    status: 200
  })
})

export default router
