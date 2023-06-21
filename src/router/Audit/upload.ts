import { Router } from 'express'
import dayjs from 'dayjs'
import multer from 'multer'
import { putObject } from '../../utils/cos'
import type { Request } from '../../types/express'

const router = Router()

const upload = multer({
  fileFilter(req, file, cb) {
    if (['image/jpeg', 'image/png'].indexOf(file.mimetype) == -1) {
      // 文件类型有误
      return cb(new Error('文件类型有误'))
    }
    cb(null, true)
  },
  limits: {
    // 1024B*1024B = 1M
    // 5M
    fileSize: 1024 * 1024 * 5
  }
}).single('file')

router.post('/', async (req: Request, res) => {
  const user = req.user
  upload(req, res, async (err) => {
    if (req.file?.buffer == undefined) {
      return res.send({ code: 403 })
    }
    if (err) {
      return res.send({
        status: 403,
        msg: (err as Error).message
      })
    }
    const fileNameData = dayjs().format('YYYYMMDDHHmmss')
    const fileNameText = `${req.file?.originalname.replace(/\.(jpg|jpeg|png)$/g, '')}`
    const fileType = req.file?.mimetype.split('/')[1]
    // fileName = userId-date-fileName.fileType
    const fileName = `${user.id}-${fileNameData}-${fileNameText}.${fileType}`
    const data = await putObject(fileName, req.file?.buffer)
    if (data.statusCode != 200) {
      return res.send({ status: 500 })
    }

    res.send({
      status: 200,
      data: {
        fileName,
        Location: data.Location
      }
    })
  })
})

export default router
