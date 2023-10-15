function getCookie(req, cookie_name) {
    const header = getCookiesHeader(req)
    
    if (!header) return

    const cookies = header.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.split('=')
        acc[key.trim()] = value.trim()
        return acc
    }, {})

    if (!cookies[cookie_name]) return

    return cookies[cookie_name]
}

function getCookiesHeader(req) {
    if (req.headers.cookie) {
        return req.headers.cookie
    }
}

module.exports = {
    getCookie,
    getCookiesHeader
}