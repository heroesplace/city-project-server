import { Router } from 'express'
import account from '../../account.js'
import auth from '../../auth.js'
import { exchange_code } from './features/discord.js'

const router = Router()

router.get("/discord", async (req, res) => {
    const code = req.query.code

    if (!code) return
    
    await exchange_code(code).then((oauthData) => {
        console.log(oauthData)
    })

    res.redirect("http://localhost:3002/game")
})

router.post("/account/register", (req, res) => {
    const { account_name, character_name, email_address, password } = req.body

    account.register(account_name, character_name, email_address, password).then(() => {
        res.status(200)

        res.json({ message: "SUCCESSFULLY_REGISTERED" })
    }).catch((e) => {
        res.status(400)
        // NOTE: This is a security issue, we should not return the error message to the client
        res.json({ message: e.message })
    })
})

router.post("/account/login", (req, res) => {
    const { account_name, password } = req.body

    account.login(account_name, password).then((token) => {
        res.status(200)

        res.json({ message: "SUCCESSFULLY_LOGGED_IN", jwt: token })
    }).catch((e) => {
        res.status(400)
        // NOTE: This is a security issue, we should not return the error message to the client
        res.json({ message: e.message })
    })
})

router.post("/account/verify-token", (req, res) => {
    const { token } = req.body

    if (!token) {
        res.status(400)
        res.json({ message: "NO_TOKEN_PROVIDED" })
    }

    auth.verifyTokenAuthenticity(token).then(() => {
        res.status(200)

        res.json({ message: "VALID_TOKEN" })
    }).catch(() => {
        res.status(400)

        res.json({ message: "INVALID_TOKEN" })
    })
})

export default router