// Ingame logic errors

class DisplayableError extends Error {
    static types = []

    constructor(message) {
        super(message)

        if (!this.isTypeCorrect(message)) {
            this.message = "Unknown error"
        }
    }

    display(socket) {
        console.log("[socket] Error : ", this.message)
        socket.emit('server_alert', { message: this.message })
    }

    isTypeCorrect(type) {
        return this.constructor.types.includes(type)
    }
}

class VillageError extends DisplayableError {
    static types = [
        "VILLAGE_NOT_FOUND",
        "VILLAGE_NAME_TAKEN"
    ]
}

class CharacterError extends DisplayableError {
    static types = [
        "CHARACTER_NOT_FOUND",
        "IS_VILLAGE_MEMBER",
    ]
}

class InviteError extends DisplayableError {
    static types = [
        "SELF_INVITE",
        "ALREADY_INVITED"
    ]
}

// Databases related errors

class DatabaseError extends Error {

}

class UniqueConstraintError extends DatabaseError {
    constructor() {
        super('23505');
    }
}

class RequestSyntaxError extends DatabaseError {
    constructor() {
        super('42601');
    }
}

module.exports = {
    DisplayableError,

    VillageError,
    InviteError,
    CharacterError,

    UniqueConstraintError,
    RequestSyntaxError
}