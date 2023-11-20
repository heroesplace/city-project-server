const handleSocketError = (socket, error) => {
    console.log("[socket] Error : ", error)
    socket.emit('server_alert', { message: error })
}

module.exports = {
    handleSocketError
}