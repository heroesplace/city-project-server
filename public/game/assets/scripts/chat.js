function send_message(e, socket) {
    e.preventDefault()
    
    let input = document.querySelectorAll("div.user-interface div.chat form.input input").item(0)
    let message = input.value

    if (message == "") return

    input.value = ""

    socket.emit("send_message", { "message": message })
}

function receive_message(data) {
    let chat = document.querySelectorAll("div.user-interface div.chat div.messages").item(0)

    let message = document.createElement("div")
        message.classList.add("message")

    let author = document.createElement("span")
        author.classList.add("author")
        author.innerText = "[" + data.username + "] "

    let content = document.createElement("span")
        content.classList.add("content")
        content.innerText = data.message

    message.appendChild(author)
    message.appendChild(content)

    chat.appendChild(message)

    let messages = document.querySelectorAll("div.user-interface div.chat div.messages").item(0)

    if (data.username == parseJwt(getCookie("jwt_token"))["username"]) {
        messages.scrollTop = messages.scrollHeight
    }
}