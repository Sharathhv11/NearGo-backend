import CustomError from "../../utils/customError.js";

// Mongoose validation error
const formatValidationError = (error) => {
  const firstKey = Object.keys(error.errors)[0];
  return new CustomError(422, error.errors[firstKey].message);
};

// Mongo duplicate key error
const formatDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const message = value
    ? `${field} '${value}' already exists.`
    : `${field} already exists.`;

  return new CustomError(409, message);
};

// Mongoose CastError (invalid ObjectId)
const formatCastError = (error) => {
  return new CustomError(400, `Invalid ${error.path}: ${error.value}`);
};

// JWT errors
const formatJWTError = () =>
  new CustomError(401, "Invalid token. Please login again.");

const formatJWTExpiredError = () =>
  new CustomError(401, "Token expired. Please login again.");

const sendResponse = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).send({
      status: "fail",
      message: error.message,
    });
  }

  res.status(500).send({
    status: "error",
    message: "Internal server error.",
  });
};

const productionError = (error, res) => {
  if (error.name === "ValidationError") {
    error = formatValidationError(error);
  }

  if (error.code === 11000) {
    error = formatDuplicateKeyError(error);
  }

  if (error.name === "CastError") {
    error = formatCastError(error);
  }

  if (error.name === "JsonWebTokenError") {
    error = formatJWTError();
  }

  if (error.name === "TokenExpiredError") {
    error = formatJWTExpiredError();
  }

  sendResponse(error, res);
};

export default productionError;
