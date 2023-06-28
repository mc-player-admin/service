import request from './request'
import { getConfig } from '../utils/config'
import { logger } from '../utils/log'

const { uuid, remote_uuid } = await getConfig('app', 'mcsm')

const execute = (command: string) =>
  request({
    url: '/api/protected_instance/command',
    method: 'get',
    params: {
      uuid: uuid,
      remote_uuid: remote_uuid,
      command
    }
  })
export default execute
const { command_add, command_remove } = await getConfig('app', 'mcsm')

export const whitelistAdd = (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    execute(command_add.replace('{name}', name))
      .then(({ data: res }) => {
        if (res.status == 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((err) => {
        logger.error(err)
        resolve(false)
      })
  })
}
export const whitelistRemove = (name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    execute(command_remove.replace('{name}', name))
      .then(({ data: res }) => {
        if (res.status == 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((err) => {
        logger.error(err)
        resolve(false)
      })
  })
}
