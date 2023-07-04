import app from './utils/express'
import router from './router/'
import { getConfig } from './utils/config'
import { useSqlVersion } from './utils/sqlVersion'

const main = async () => {
  const baseUrl = await getConfig('app', 'base_url')
  app.get(baseUrl, (req, res) => {
    res.send({
      status: 200,
      msg: 'hello world'
    })
  })

  app.use(baseUrl, router)

  const port = await getConfig('app', 'port')
  app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  })
}
await useSqlVersion()
main()
