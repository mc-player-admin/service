import { Router } from 'express'
import submit from './submit'
import upload from './upload'

const router = Router()

router.use('/submit', submit)
router.use('/upload', upload)

export default router
