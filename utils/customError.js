class CustomError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    this.code = options.code || null;
    this.meta = options.meta || null;

    Error.captureStackTrace(this, CustomError);
  }
}

export default CustomError;
