import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { parse } from 'yaml'
import { logger } from './log'
import argvs from './argv'
import { Config } from '../types/config'

const configPath = argvs.config || 'config.yml'

logger.info(`加载配置文件 ${configPath}`)
if (!existsSync(configPath)) {
  logger.warn('未找到配置文件，将尝试自动创建')
  try {
    const defaultConfig = readFileSync('./template/config.template.yml')
    writeFileSync(configPath, defaultConfig, 'utf-8')
  } catch (e) {
    logger.error(
      '配置文件创建失败，请手动复制 template/config.template.yml 为 config.yml 修改配置后重新启动'
    )
    process.exit()
  }
  logger.info('未找到配置文件，已自动创建，请修改 config.yml 配置并重新启动')
  process.exit()
}

const config = parse(readFileSync('config.yml', 'utf8')) as {
  [name in keyof Config]?: Config[name]
}

export default config
