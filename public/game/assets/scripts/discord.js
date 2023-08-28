
window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    console.log(accessToken)

    if (!accessToken) {
    } else {
        socket.emit("discord_auth_token", accessToken)
    }

}