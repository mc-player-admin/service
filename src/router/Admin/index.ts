import { Router } from 'express'
import { auth } from '../../utils/permission'
import audit from './audit'
import editPlayer from './editPlayer'

const router = Router()

router.use('/audit', auth('admin', 'audit'), audit)
router.use('/editPlayer', auth('admin', 'edit_player'), editPlayer)

export default router
