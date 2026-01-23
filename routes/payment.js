import { Router } from "express";
import authorize from "../controllers/authorization.js";
import orderPayment from "../controllers/razorpay/order.js";


const paymentGateway = Router();

paymentGateway.post("/order",authorize,orderPayment);

export default paymentGateway;