export class SkullError extends Error {
    status: number = 500;

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = "SkullError"
        this.status = status
    }
}

export class ModelNotFound extends SkullError {
    constructor(message: string) {
        super(message, 404);
        this.name = "Model Not Found"
    }
}

export class NotFound extends SkullError {
    constructor(message: string) {
        super(message, 404);
        this.name = "Not Found"
    }
}

export class Unauthenticated extends SkullError {
    constructor(message: string) {
        super(message, 401);
        this.name = "Unauthenticated "
    }
}

export class Unauthorized extends SkullError {
    constructor(message: string) {
        super(message, 403);
        this.name = "Unauthorized"
    }
}