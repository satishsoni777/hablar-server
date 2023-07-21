export class BaseController {

    constructor() { }

    successResponse(data, res, statusCode = HTTPFailureStatus.SUCCESS) {
        data.success = true;
        return res.status(statusCode).send(data);
    }

    errorResponse(error, res, statusCode = HTTPFailureStatus.INTERNAL_SERVER_ERROR) {
        error = { error: error }
        error.success = false;
        return res.status(statusCode).send(error);
    }
    errorMessage(statusCode) {
        switch (statusCode) {
            case HTTPFailureStatus.BAD_REQUEST:
                return 'Bad Request';
            case HTTPFailureStatus.UNAUTHORIZED:
                return 'Unauthorized';
            case HTTPFailureStatus.FORBIDDEN:
                return 'Forbidden';
            case HTTPFailureStatus.NOT_FOUND:
                return 'Not Found';
            case HTTPFailureStatus.INTERNAL_SERVER_ERROR:
                return 'Internal Server Error';
            default:
                return 'Unknown Error';
        }
    }
}

export const HTTPFailureStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SUCCESS: 200,
    // Add more failure statuses as needed
};