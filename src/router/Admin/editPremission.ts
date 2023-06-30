import { Router } from 'express'
import { query } from '../../utils/db'

const router = Router()

router.post('/getGroups', async (req, res) => {
  const [err, result] = await query`select * from permission_groups`
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

router.post('/getPermission', async (req, res) => {
  const { group } = req.body
  const [err, result] = await query`
    select * from permission_group where permission_group.group=${group}
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

router.post('/setPermission', async (req, res) => {
  const { group, name, value } = req.body

  const [err, result] = await query`select * from permission_group
  where permission_group.group=${group} and name=${name}
  `
  if (err) {
    return res.send({
      status: 500
    })
  }
  // 新增
  if (result.length < 1) {
    const [err, result] = await query`insert into permission_group set ${{
      group,
      name,
      value: value ? 1 : 0
    }}`
    if (err) {
      return res.send({
        status: 500
      })
    }
    res.send({
      status: 200,
      data: result
    })
  } else {
    // 修改
    const [err, result] = await query`
    update permission_group 
    set value=${value ? 1 : 0}
    where permission_group.group=${group} and name=${name}
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
  }
})

export default router
