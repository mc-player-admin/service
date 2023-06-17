export interface Config {
  readonly system: {
    version: string
    sql_version: string
  }
  readonly app: {
    port: number
    base_url: string
    jwt_secret_key: string
    mysql: {
      host: string
      user: string
      password: string
      database: string
      port: number
    }
    mail: {
      host: string
      port: number
      secure: boolean
      auth: {
        user: string
        pass: string
      }
    }
    qq_connect?: {
      appid: string
      appkey: string
      redirect_uri: string
    }
  }
}
