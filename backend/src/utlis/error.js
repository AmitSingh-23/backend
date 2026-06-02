class API_ERROR extends Error{
    consturvtor(
        statusCode,
        message="Something went wrong",
        success=false,
        errors=[]
    ){super(message);
        this.statusCode = statusCode;
        this.success = success;
        this.errors = errors;
    }
}