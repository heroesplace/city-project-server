import { request } from 'undici'
import fs from 'fs'

const config = JSON.parse(fs.readFileSync('./private/discord/config.json', 'utf8'))

const exchangeCode = async (code) => {
  console.log(`The access code is: ${code}`)

  try {
    const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/api/discord',
        scope: 'identify'
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const oauthData = await tokenResponseData.body.json()
    return oauthData
  } catch (error) {
    // NOTE: An unauthorized token will not throw an error
    // tokenResponseData.statusCode will be 401
    console.error(error)
  }
}

export {
  exchangeCode
}
