const router = require('express').Router()
const jwt = require("jsonwebtoken");
const account = require("../../account")
const auth = require("../../auth")

router.post("/account/register", (req, res) => {
    const { account_name, character_name, email_address, password } = req.body

    if (account_name && character_name && email_address && password) {
        account.register(account_name, character_name, email_address, password).then((e) => {
            res.status(200)

            console.log(e)
            res.json({
                message: e
            })
        }).catch((e) => {
            res.status(403)
            res.json({
                message: e.message
            })
        })
    } else {
        res.status(403)
        res.json({
            message: "Missing fields !"
        })
    }
})

router.post("/account/login", (req, res) => {
    const { account_name, password } = req.body

    account.login(account_name, password).then((e) => {
        const token = auth.generateToken(account_name)
    
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict'
        })

        res.status(200)

        res.json({
            message: e
        })
    }).catch((e) => {
        res.status(403)
        res.json({
            message: e.message
        })
    })
})

router.get("/account/profile", (req, res) => {
    if (req.headers.cookie) {
        // FIX LATER
        const cookies = req.headers.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key.trim()] = value.trim();
            return acc;
        }, {});

        if (cookies["token"]) {
            res.json({
                "username": jwt.decode(cookies["token"])
            })
        }
    } else {
        res.status(403)
        res.json({
            message: "Not logged in !",
        })
    }
})

module.exports = router