import express from 'express'
import bodyParser from 'body-parser'
import expressJWT from 'express-jwt'
import { logger } from './log'
import cors from 'cors'

const app = express()
app.use(cors())

// 中间件记录日志
app.use('*', (req: any, res, next) => {
  // 用于记录特定时间的日志输出
  try {
    req.userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  } catch (e) {
    console.log(e)
  }
  next()
  logger.info(
    `ip:${req.userIp}  请求:${req.path}  user-agent:${req.headers['user-agent']}`
  )
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(
//   expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({
//     path: JWTUnless
//   })
// )

// 错误中间件
app.use(
  (
    err: express.Errback,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError')
      return res.send({ status: 4003, msg: '认证失败，请重新登录' })
  }
)

export default app
