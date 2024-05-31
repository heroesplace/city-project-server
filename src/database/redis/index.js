import { Redis } from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const options = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379
}

const client = new Redis(options)

client.on('connect', () => {
  console.log('[db-redis] Successfully connected to Redis database')
})

client.on('error', (err) => {
  console.error('[db-redis]', err)
  process.exit(-1)
})

const getClient = () => client
const getAdapterClient = () => new Redis(options)

export {
  getClient,
  getAdapterClient
}
