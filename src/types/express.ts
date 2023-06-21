import { Request as ExpressRequest, Express } from 'express'

export interface User extends Express.User {
  id: number
}

export interface Request extends ExpressRequest {
  userIp: string
  user: User
}

// player
export interface Inquires extends ExpressRequest {
  parameter: string
}
