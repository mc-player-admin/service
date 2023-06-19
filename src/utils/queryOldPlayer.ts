import { query } from './db'

export const queryOldPlayer = async (qq: string, name: string, userId: number) => {
  // 用户是否申请过白名单
  {
    const [err, result] = await query`select * from players where user=${userId}`
    if (err) {
      return false
    }
    if (result.length >= 1) {
      return '您已申请过白名单'
    }
  }
  // 是否已占用
  // todo: 查找审核中的
  {
    const [err, result] = await query`select * from players where name=${name}`
    if (err) {
      return false
    }
    if (result.length >= 1) {
      return '玩家名已被占用'
    }
  }
  {
    const [err, result] = await query<
      {
        id: number
        name: string
        date: Date
        status: number
        qq: string
      }[]
    >`
    select * from old_players_2 where name=${name} and qq=${qq} and status=1
    `
    if (err) {
      return false
    }
    if (result.length >= 1) {
      return {
        name: result[0].name,
        date: result[0].date,
        qq: result[0].qq
      }
    }
  }
  {
    const [err, result] = await query<
      {
        id: number
        name: string
        date: Date
        status: number
        qq: string
      }[]
    >`
    select * from old_players_2 where name=${name} and qq=${qq}
    `
    if (err) {
      return false
    }
    if (result.length >= 1) {
      return {
        id: result[0].id,
        name: result[0].name,
        date: result[0].date,
        qq: result[0].qq
      }
    }
  }
}
