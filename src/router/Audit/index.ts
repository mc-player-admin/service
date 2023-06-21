import { Router } from 'express'
import submit from './submit'

const router = Router()

router.use('/submit', submit)

export default router
