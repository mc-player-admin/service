export interface Config {
  readonly system: {
    version: string
  }
  readonly app: {
    port: number
    base_url: string
  }
}
