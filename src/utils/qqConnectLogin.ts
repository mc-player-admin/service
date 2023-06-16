import axios from 'axios'

export const getAccessToken = async (appid: string, appkey: string, code: string) => {
  const { data: res } = await axios<{
    access_token: string
    expires_in: number
    refresh_token: string
  }>({
    method: 'get',
    url: 'https://graph.qq.com/oauth2.0/token',
    params: {
      grant_type: 'authorization_code',
      client_id: appid,
      client_secret: appkey,
      code,
      // 回调放在初始化阶段获取
      redirect_uri: 'https://moon.mcxing.cn/login/qqAccessCallback',
      fmt: 'json'
    }
  })
  return res
}

export const getOpenId = async (access_token: string) => {
  const { data: res } = await axios<{
    client_id: string
    openid: string
  }>({
    method: 'get',
    url: 'https://graph.qq.com/oauth2.0/me',
    params: {
      access_token,
      fmt: 'json'
    }
  })
  return res
}

interface UserInfo {
  ret: number
  msg: string
  is_lost: number
  nickname: string
  gender: string
  gender_type: number
  province: string
  city: string
  year: string
  constellation: string
  figureurl: string
  figureurl_1: string
  figureurl_2: string
  figureurl_qq_1: string
  figureurl_qq_2?: string
  figureurl_qq: string
  figureurl_type: string
  is_yellow_vip: string
  vip: string
  yellow_vip_level: string
  level: string
  is_yellow_year_vip: string
}
export const getUserInfo = async (
  access_token: string,
  appid: string,
  openid: string
) => {
  const { data: res } = await axios<UserInfo>({
    method: 'get',
    url: 'https://graph.qq.com/user/get_user_info',
    params: {
      access_token,
      oauth_consumer_key: appid,
      openid
    }
  })
  return res
}
