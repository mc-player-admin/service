import { Router } from 'express'
import { queryOldPlayer } from '../../utils/queryOldPlayer'
import { Request } from '../../types/express'

const router = Router()

router.post('/checkName', async (req: Request, res) => {
  const { qq, name } = req.body
  const player = await queryOldPlayer(qq, name, req.user.id)
  if (player.usable == false) {
    return res.send({
      status: 403,
      msg: player.msg
    })
  }
  res.send({ status: 200 })
})

export default router
