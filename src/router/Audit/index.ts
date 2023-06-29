import { Router } from 'express'
import submit from './submit'
import upload from './upload'
import query from './query'

const router = Router()

router.use('/submit', submit)
router.use('/upload', upload)
router.use('/query', query)

export default router
