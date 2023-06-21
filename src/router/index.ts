import { Router } from 'express'
import user from './User/'
import audit from './Audit/'

const router = Router()

router.use('/user', user)
router.use('/audit', audit)

export default router
