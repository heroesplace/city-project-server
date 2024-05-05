import { Router } from 'express'
import account from '../../account.js'
import auth from '../../auth.js'
import { exchangeCode } from './features/discord.js'

const router = Router()

router.get('/discord', async (req, res) => {
  const code = req.query.code

  if (!code) return

  await exchangeCode(code).then((oauthData) => {
    console.log(oauthData)
  })

  res.redirect('http://localhost:3002/game')
})

router.post('/account/register', (req, res) => {
  const { accountName, characterName, emailAddress, password } = req.body

  account.register(accountName, characterName, emailAddress, password).then(() => {
    res.status(200)

    res.json({ message: 'SUCCESSFULLY_REGISTERED' })
  }).catch((e) => {
    res.status(400)
    // NOTE: This is a security issue, we should not return the error message to the client
    res.json({ message: e.message })
  })
})

router.post('/account/login', (req, res) => {
  const { accountName, password } = req.body

  account.login(accountName, password).then((token) => {
    res.status(200)

    res.json({ message: 'SUCCESSFULLY_LOGGED_IN', jwt: token })
  }).catch((e) => {
    res.status(400)
    // NOTE: This is a security issue, we should not return the error message to the client
    res.json({ message: e.message })
  })
})

router.post('/account/verify-token', (req, res) => {
  const { token } = req.body

  if (!token) {
    res.status(400)
    res.json({ message: 'NO_TOKEN_PROVIDED' })
  }

  auth.verifyTokenAuthenticity(token).then(() => {
    res.status(200)

    res.json({ message: 'VALID_TOKEN' })
  }).catch(() => {
    res.status(400)

    res.json({ message: 'INVALID_TOKEN' })
  })
})

export default router
