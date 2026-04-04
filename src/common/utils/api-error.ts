class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        // prototype fix (important in TS)
        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = "Bad request"): ApiError {
        return new ApiError(400, message);
    }

    static unauthorized(message: string = "Unauthorized"): ApiError {
        return new ApiError(401, message);
    }

    static conflict(message: string = "Conflict"): ApiError {
        return new ApiError(409, message);
    }

    static forbidden(message: string = "Forbidden"): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = "Not Found"): ApiError {
        return new ApiError(404, message);
    }
}

export default ApiError;
