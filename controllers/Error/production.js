import CustomError from "../../utils/customError.js";

const formatValidationError = (error) => {
  let messages = [];
  for (let er in error.errors) {
    messages.push(error.errors[er].message);
  }
  const message = messages.join(", ");
  return new CustomError(422,message);
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

  

    sendResponse(error,res);
};

export default productionError;
