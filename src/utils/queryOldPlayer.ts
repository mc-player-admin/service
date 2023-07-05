import { query } from './db'

type Result =
  | { usable: false; msg?: string }
  | { usable: true; id?: number; name?: string; date?: Date; qq?: string }

export const queryOldPlayer = async (
  qq: string,
  name: string,
  userId: number
): Promise<Result> => {
  if (!qq || !name) {
    return {
      usable: false
    }
  }
  // 用户是否申请过白名单
  {
    const [err, result] = await query`select * from players where user=${userId}`
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '您已申请过白名单'
      }
    }
  }
  // 查找审核中的
  {
    const [err, result] = await query`
      select * from audits where name=${name} and status=1
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '该游戏id已申请白名单'
      }
    }
  }
  // 是否已占用
  {
    const [err, result] = await query`select * from players where name=${name}`
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: false,
        msg: '玩家名已被占用'
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
    select * from old_players_2 where name=${name} and qq=${qq} and status=1
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length >= 1) {
      return {
        usable: true,
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
    select * from old_players_1 where name=${name} and qq=${qq}
    `
    if (err) {
      return {
        usable: false
      }
    }
    if (result.length < 1) {
      return {
        usable: false
      }
    }
    return {
      usable: true,
      id: result[0].id,
      name: result[0].name,
      date: result[0].date,
      qq: result[0].qq
    }
  }
}
