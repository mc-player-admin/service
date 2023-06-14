import bcrypt from 'bcryptjs'

export const toHash = (text: string) => {
  const salt = bcrypt.genSaltSync(10)
  console.log(text, salt)
  return bcrypt.hashSync(text, salt)
}

export const check = (text: string, hash: string) => {
  return bcrypt.compareSync(text, hash)
}
