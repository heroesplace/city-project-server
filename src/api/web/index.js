const router = require('express').Router()
const account = require("../../account")
const auth = require("../../auth")

router.post("/account/register", (req, res) => {
    const { account_name, character_name, email_address, password } = req.body

    if (account_name && character_name && email_address && password) {
        account.register(account_name, character_name, email_address, password).then(() => {
            res.status(200)

            res.json({
                message: 'Successfully registered !',
                status: 200
            })
        }).catch((e) => {
            res.status(403)
            res.json({
                message: e.message,
                status: 403
            })
        })
    } else {
        res.status(403)
        res.json({
            message: "Missing fields !",
            status: 403
        })
    }
})

router.post("/account/login", (req, res) => {
    const { account_name, password } = req.body

    account.login(account_name, password).then((token) => {
        res.status(200)

        res.json({
            message: "Successfully logged in !",
            jwt: token,
            status: 200
        })
    }).catch((e) => {
        res.status(403)
        res.json({
            message: e.message,
            status: 403
        })
    })
})

router.post("/account/verify-token", (req, res) => {
    const { token } = req.body

    if (token) {
        auth.verifyTokenAuthenticity(token).then(() => {
            res.status(200)
    
            res.json({
                message: "VALID_TOKEN",
                status: 200
            })
        }).catch((err) => {
            res.status(403)

            res.clearCookie('token', {
                httpOnly: false,
                sameSite: 'strict'
            })

            res.json({
                message: err.message,
                status: 403
            })
        })
    } else {
        res.status(403)
        res.json({
            message: "Not logged in !",
        })
    }
})

module.exports = router