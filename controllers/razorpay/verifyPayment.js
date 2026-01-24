import handelAsyncFunction from "./../../utils/asyncFunctionHandler.js";
import CustomError from "./../../utils/customError.js";
import crypto from "crypto";

const verifyPayment = handelAsyncFunction(async function (req, res, next) {
  const validFields = [
    "razorpay_order_id",
    "razorpay_payment_id",
    "razorpay_signature",
  ];

  Object.keys(req.body).forEach((key) => {
    if (!validFields.includes(key)) delete req.body[key];
  });

  if (
    !req.body["razorpay_order_id"] ||
    !req.body["razorpay_payment_id"] ||
    !req.body["razorpay_signature"]
  ) {
    return next(
      new CustomError(
        400,
        "razorpay_order_id, razorpay_payment_id and razorpay_signature are required fields.",
      ),
    );
  }

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

  //*   order_id + "|" + razorpay_payment_id, secret
  sha.update(`${req.body.razorpay_order_id}|${req.body.razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== req.body.razorpay_signature) {
    return next(new CustomError(403, "Invalid payment signature."));
  }

  const user = req.user;

  // Subscription duration
  const PREMIUM_DAYS = Number(process.env.PREMIUM_DAYS);
  const now = Date.now();

  let newExpiry;

  if (
    user.account.type === "premium" &&
    user.account.expiresAt &&
    user.account.expiresAt > now
  ) {
    // Extend existing subscription
    newExpiry = new Date(
      user.account.expiresAt.getTime() + PREMIUM_DAYS * 24 * 60 * 60 * 1000,
    );
  } else {
    // Fresh subscription
    newExpiry = new Date(now + PREMIUM_DAYS * 24 * 60 * 60 * 1000);
  }

  user.account.type = "premium";
  user.account.expiresAt = newExpiry;

  user.account.paymentInfo = {
    razorpay_order_id: req.body.razorpay_order_id,
    razorpay_payment_id: req.body.razorpay_payment_id,
    razorpay_signature: req.body.razorpay_signature,
  };

  const updatedUser = await user.save();

  res.status(200).send({
    status: "success",
    message: "successfully validated payment.",
    data: updatedUser,
  });
});

export default verifyPayment;
