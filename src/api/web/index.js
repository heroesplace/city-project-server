const router = require('express').Router()
const jwt = require("jsonwebtoken");
const account = require("../../account")
const auth = require("../../auth")
const cookies = require("../../cookies")

router.post("/account/register", (req, res) => {
    const { account_name, character_name, email_address, password } = req.body

    if (account_name && character_name && email_address && password) {
        account.register(account_name, character_name, email_address, password).then((e) => {
            res.status(200)

            res.json({
                message: e,
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
        res.cookie('token', token, {
            httpOnly: false,
            sameSite: 'strict'
        })

        res.status(200)

        res.json({
            message: "Successfully logged in !",
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


router.post("/character/create_village", (req, res) => {
    /*const { village_name, members_list } = req.body

    if (req.headers.cookie) {
        const token = cookies.getCookie(req, "token")

        if (token) {
            const username = jwt.decode(token) // HERE

            console.log(username)
            village.createVillage(username, village_name, members_list).then(() => {
                res.status(200)

                res.json({
                    message: "Successfully created village !",
                    status: 200
                })
            }).catch((e) => {
                res.status(403)
                res.json({
                    message: e.message,
                    status: 403
                })
            })
        }
    } else {
        res.status(403)
        res.json({
            message: "Not logged in !",
        })
    }*/
})

// GET
router.get("/account/logout", (req, res) => {
    res.clearCookie('token', {
        httpOnly: false,
        sameSite: 'strict'
    })

    res.status(200)

    res.json({
        message: "Successfully logged out !",
        status: 200
    })
})

router.get("/account/profile", (req, res) => {
    if (req.headers.cookie) {
        const token = cookies.getCookie(req, "token")

        if (token) {
            res.json({
                "username": jwt.decode(token)
            })
        }
    } else {
        res.status(403)
        res.json({
            message: "Not logged in !",
        })
    }
})

router.get("/account/verify-token", (req, res) => {
    const token = cookies.getCookie(req, "token")

    if (token) {
        auth.verifyTokenAuthenticity(token).then(() => {
            res.status(200)
    
            res.json({
                message: "Token is valid !",
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