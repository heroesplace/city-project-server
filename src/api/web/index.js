const router = require('express').Router()
const jwt = require("jsonwebtoken");
const account = require("../../account")
const auth = require("../../auth")
const cookies = require("../../cookies")

const { onInviteCharacter } = require("./features/invitations")
const { getCharacterId } = require("../../character")

const { io } = require("../socket/index")

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

router.post("/invitations/invite_character", (req, res) => {
    const { character_name } = req.body
    const token = req.headers.authorization.split(' ')[1]

    auth.verifyTokenAuthenticity(token).then((decoded) => {
        getCharacterId(character_name).then((character_id) => {
            onInviteCharacter(decoded.character_id, character_id).then((err) => {
                // io.to(character_id).emit("server_alert", { message: "Vous avez reçu une invitation !" })
                res.status(err.code).json({ code: err.message, message: err.clientMessage })
            }).catch((err) => {
                res.status(err.code).json({ code: err.message, message: err.clientMessage })
            })
        }).catch((err) => {
            res.status(err.code).json({ code: err.message, message: err.clientMessage })
        })
    }).catch((err) => {
        res.status(err.code).json({ code: err.message, message: err.clientMessage })
    })
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