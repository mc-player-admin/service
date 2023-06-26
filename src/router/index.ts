import { Router } from 'express'
import user from './User/'
import audit from './Audit/'
import player from './Player/'
import admin from './Admin/'

const router = Router()

router.use('/user', user)
router.use('/audit', audit)
router.use('/player', player)
router.use('/admin', admin)

export default router
