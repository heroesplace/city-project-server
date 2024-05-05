import { createClient } from 'redis'

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379
  }
})

client.on('error', (err) => console.log('Redis Client Error', err))

await client.connect()

const getClient = () => client

export {
  getClient
}
