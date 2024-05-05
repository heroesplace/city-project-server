import { createClient } from 'redis'

const client = createClient({
  socket: {
    host: '192.168.1.90',
    port: 6379
  }
})

client.on('error', (err) => console.log('Redis Client Error', err))

await client.connect()

const getClient = () => client

export {
  getClient
}