class DatabaseError extends Error {

}

class UniqueConstraintError extends DatabaseError {
    constructor() {
        super('23505')
    }
}

class RequestSyntaxError extends DatabaseError {
    constructor() {
        super('42601')
    }
}

class UndefinedTableError extends DatabaseError {
    constructor() {
        super('42P01')
    }
}

export {
    DatabaseError,
    UniqueConstraintError,
    RequestSyntaxError,
    UndefinedTableError
}