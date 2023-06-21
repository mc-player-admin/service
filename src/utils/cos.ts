import COS from 'cos-nodejs-sdk-v5'
import type { PutObjectResult } from 'cos-nodejs-sdk-v5'
import { getConfig } from './config'

const { SecretId, SecretKey, Bucket, Region } = await getConfig('app', 'cos')

export const cos = new COS({
  SecretId: SecretId,
  SecretKey: SecretKey
})

export const putObject = (filename: string, buffer: Buffer): Promise<PutObjectResult> => {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: Bucket,
        Region: Region,
        Key: filename,
        Body: buffer
      },
      function (err, data) {
        resolve(data)
      }
    )
  })
}
