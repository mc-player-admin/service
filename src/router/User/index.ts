import { Router } from 'express'
import register from './register'

const router = Router()

router.use('/register', register)

export default router
