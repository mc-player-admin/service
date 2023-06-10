export interface Config {
  readonly system: {
    version: string
  }
  readonly app: {
    port: number
    base_url: string
    mysql: {
      host: string
      user: string
      password: string
      database: string
      port: number
    }
  }
}
