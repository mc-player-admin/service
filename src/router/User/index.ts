import { Router } from 'express'
import register from './register'
import login from './login'
import getUserInfo from './getUserInfo'

const router = Router()

router.use('/register', register)
router.use('/login', login)
router.use('/getUserInfo', getUserInfo)

export default router
