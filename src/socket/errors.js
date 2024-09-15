class DisplayableError extends Error {
  static types = []

  constructor (message) {
    super(message)

    if (!this.isTypeCorrect(message)) this.message = 'Unknown error'
  }

  display (socket) {
    console.log('[socket] Error : ', this.message)
    socket.emit('server_alert', { message: this.message })
  }

  isTypeCorrect (type) {
    return this.constructor.types.includes(type)
  }
}

export {
  DisplayableError
}
