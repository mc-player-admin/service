import { Router } from 'express'
import audit from './audit'
import { auth } from '../../utils/permission'

const router = Router()

router.use(
  '/audit',
  auth({
    admin: {
      audit: true
    }
  }),
  audit
)

export default router
