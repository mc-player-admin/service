import { Router } from 'express'
import inquires from './inquires'

const router = Router()

router.use('/inquires', inquires)

export default router
