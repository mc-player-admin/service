import { Router } from 'express'
import { auth } from '../../utils/permission'
import audit from './audit'
import editPlayer from './editPlayer'
import editPremission from './editPremission'

const router = Router()

router.use('/audit', auth('admin', 'audit'), audit)
router.use('/editPlayer', auth('admin', 'edit_player'), editPlayer)
router.use('/editPremission', auth('admin', 'edit_permission'), editPremission)

export default router
