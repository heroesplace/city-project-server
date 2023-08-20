const jwt = require('jsonwebtoken')

exports.SECRET_KEY = 'votre_clé_secrète'

exports.verifyToken = (req, res, next) => {
    if (!req.headers.cookie) {
        return res.status(401).json({ message: 'Token manquant' })
    }

    console.log(req.headers.cookie)

    const token = req.headers.cookie.split('=')[1]

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' })
    }

    jwt.verify(token, this.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' })
        }
    
        req.user = decoded

        next()
    })
}