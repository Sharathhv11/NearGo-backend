import handelAsyncFunction from "./../../utils/asyncFunctionHandler.js";
import CustomError from "./../../utils/customError.js";
import razorpay from "./../../configure/razorpay.js";

const orderPayment = handelAsyncFunction(async function (req, res, next) {
  let options = {};

  const validFields = ["amount", "currency", "receipt", "notes"];

  //^ filtering the data 
  Object.keys(req.body).forEach((key) => {
    if (validFields.includes(key)) {
      options[key]  = req.body[key];
    }
  });

  if(!Object.keys(options).length){
    return next(new CustomError(400,"No valid filed is provided in the body."));
  }

  if(!options["amount"]  || !options["currency"]){
     return next(new CustomError(400,"Amount and currency are required fields."));
  }

  if( typeof options["amount"] !== "number" || options["amount"] <= 0 ){
    return next(new CustomError(400,"Please provide the valid amount."))
  }
  

  //* razor pay accept amount in paise 
  //^ converting into paise
  options.amount = options.amount * 100;

  const order = await razorpay.orders.create(options);

  res.status(200).send({
    status:"success",
    message:"order created successfully",
    data : order
  });
});

export default orderPayment;
