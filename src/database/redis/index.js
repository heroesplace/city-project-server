import { createClient } from 'redis'

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
  }
})

await client.connect().then(() => {
  console.log('[database] Successfully connected to Redis database')
}).catch(err => {
  console.error('[database]', err)
  process.exit(-1)
})

const getClient = () => client

export {
  getClient
}
