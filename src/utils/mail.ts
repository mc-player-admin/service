import nodemailer from 'nodemailer'
import { getConfig } from './config'

const mail = await getConfig('app', 'mail')

export const transporter = nodemailer.createTransport(mail)

export const sendMail = (config: {
  from: string
  to: string
  subject: string
  html: string
}) => {
  return transporter.sendMail(config)
}
