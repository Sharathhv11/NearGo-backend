import CustomError from "../../utils/customError.js";

const formatValidationError = (error) => {
  // Get first validation error only
  const firstKey = Object.keys(error.errors)[0];
  const message = error.errors[firstKey].message;

  return new CustomError(422, message);
};

const formatDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];

  const message = value
    ? `${field} '${value}' already exists.`
    : `${field} already exists.`;

  return new CustomError(409, message);
};




const sendResponse = ( error,res ) => {
   
    if( error.isoperational ){
        res.status(error.statusCode).send({
            status:"fail",
            message : error.message
        });
    }else{
        res.status(500).send({
            status:"fail",
            message:"Internal server error."
        });
    }
} 

const productionError = (error, res) => {

  if (error.name === "ValidationError") {
    error = formatValidationError(error);
    
  }

  if (error.code === 11000) {
    error = formatDuplicateKeyError(error);
  }

  

    sendResponse(error,res);
};

export default productionError;
