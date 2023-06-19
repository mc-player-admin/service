import { getConfig } from '../utils/config'
import { sendMail } from '../utils/mail'

const codes: {
  mail: string
  date: number
  code: string
}[] = []

const { emial_code } = await getConfig('app', 'template')
export const createCode = async (mail: string) => {
  // 查找没有超过60秒的
  const last = codes.find((e) => {
    return e.mail == mail && e.date + 1000 * 60 > Date.now()
  })

  if (last) {
    return false
  }
  const code = (Math.floor(Math.random() * 100000) + 100000).toString()
  await sendMail({
    to: mail,
    html: emial_code.template.replace('{{code}}', code),
    subject: emial_code.subject,
    from: emial_code.from
  })
  codes.push({
    code,
    mail,
    date: Date.now()
  })
  return true
}
export const checkCode = (mail: string, code: string) => {
  const index = codes.findIndex((e) => {
    return mail == e.mail && e.code == code && e.date + 1000 * 60 * 10 > Date.now()
  })

  if (index == -1) {
    return false
  }
  codes.splice(index, 1)
  return true
}
