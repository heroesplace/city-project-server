class ErrorCode extends Error {
    constructor(code, extended_code, clientMessage) {
        super(extended_code)
        this.code = code
        this.clientMessage = clientMessage

        // console.log(this.code + " " + this.message + " " + this.clientMessage)
    }
}

module.exports = {
    ErrorCode
}