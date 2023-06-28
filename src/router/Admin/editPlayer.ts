import { Router } from 'express'
import { query } from '../../utils/db'
import { whitelistAdd, whitelistRemove } from '../../mcsmApis/execute'

const router = Router()

router.post('/getPlayers', async (req, res) => {
  const [err, result] = await query`
  select
    players.id,
    players.name,
    players.user,
    players.status,
    players.type,
    players.transfer_id,
    users.username,
    users.qq,
    users.primary_email,
    users.register_date,
    users.primary_permission_group
  from players
  left join users on users.id=players.user
  `
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

router.post('/rename', async (req, res) => {
  const { id, newName } = req.body
  // 查询
  const [err, result] = await query<
    {
      id: number
      user: number
      name: string
      status: number
    }[]
  >`select * from players where id=${id} and status=1`
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
  const player = result[0]
  // 删旧的 加新的
  {
    const remove = await whitelistRemove(player.name)
    const add = await whitelistAdd(newName)
    if (!remove || !add) {
      return res.send({
        status: 500,
        msg: '白名单添加/删除失败'
      })
    }
  }
  // 修改表
  {
    const [err] = await query`update players set name=${newName} where id=${player.id}`
    if (err) {
      return res.send({
        status: 500
      })
    }
  }
  res.send({
    status: 200
  })
})

export default router
