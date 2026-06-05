class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        success=false,
        errors=[]
    ){super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
        this.errors = errors;
    }
}
export {ApiError}