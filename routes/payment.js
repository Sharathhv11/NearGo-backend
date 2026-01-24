import { Router } from "express";
import authorize from "../controllers/authorization.js";
import orderPayment from "../controllers/razorpay/order.js";
import verifyPayment from "../controllers/razorpay/verifyPayment.js";


const paymentGateway = Router();

paymentGateway.post("/order",authorize,orderPayment);

paymentGateway.post("/verification",authorize,verifyPayment);

export default paymentGateway;