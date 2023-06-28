import axios from 'axios'
import { getConfig } from '../utils/config'

const { apiKey, url } = await getConfig('app', 'mcsm')

axios.defaults.baseURL = url

// http request 拦截器
axios.interceptors.request.use(
  (e) => {
    if (!e.params) {
      e.params = {}
    }

    e.params.apikey = apiKey
    return e
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default axios
