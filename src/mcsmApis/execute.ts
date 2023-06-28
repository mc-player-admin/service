import request from './request'
import { getConfig } from '../utils/config'

const { uuid, remote_uuid } = await getConfig('app', 'mcsm')

export default (command: string) =>
  request({
    url: '/api/protected_instance/command',
    method: 'get',
    params: {
      uuid: uuid,
      remote_uuid: remote_uuid,
      command
    }
  })
