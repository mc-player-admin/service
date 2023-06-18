import { Router } from 'express'
import register from './register'
import login from './login'
import getUserInfo from './getUserInfo'
import getCode from './getCode'

const router = Router()

router.use('/register', register)
router.use('/login', login)
router.use('/getUserInfo', getUserInfo)
router.use('/getCode', getCode)

export default router
