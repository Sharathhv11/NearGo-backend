import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import userModel from "./../../models/userModel.js";
import CustomError from "../../utils/customError.js";


const getUserInfo = handelAsyncFunction(async (req, res, next) => {
  const user = req.user;
  const { userID } = req.query;

  let target = {};

  if (!userID || user._id.toString() === userID) {
    target = user;
  } else {
    target = await userModel.findById(userID).lean();
    if (!target) {
      return next(new CustomError(404, "User not found"));
    }
  }
  const isActivePremium =
    target.account.type === "premium" &&
    target.account.expiresAt &&
    target.account.expiresAt > Date.now();

  const filteredUser = {
    id: target._id,
    email: target.email,
    name: target.name ?? null,
    username: target.username ?? null,
    phone_no: target.phone_no ?? null,
    interest: target.interest ?? [],
    role: target.role,
    verified: target.verified,
    profilePicture: target.profilePicture,
    authProvider: target.authProvider,
    profileCompleted: target.profileCompleted,
    account: {
      type: isActivePremium ? "premium" : "free",
      expiresAt :  target.account.expiresAt
    },

    createdAt: target.createdAt,
  };

  return res.status(200).json({
    status: "success",
    message: "user information fetched successfully.",
    data: filteredUser,
  });
});

export default getUserInfo;
