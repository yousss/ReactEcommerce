class ErrorHandler extends Error {
    constructor(statusCode, code, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;
    }
}
const handleError = (err, res) => {
    const { statusCode, code, message } = err;
    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        code
    });
};
const logErrors = (err, req, res, next) => {
    console.error(err.stack)
    next(err)
}

const clientErrorHandler = (err, req, res, next) => {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' })
    } else {
        next(err)
    }
}

module.exports = {
    ErrorHandler,
    clientErrorHandler,
    handleError,
    logErrors
}
