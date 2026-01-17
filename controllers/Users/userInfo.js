import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "./../../utils/customError.js"
import userModel from "./../../models/userModel.js"

const getUserInfo = handelAsyncFunction(async (req, res, next) => {
  const user = req.user;
  const {userID} = req.query;

  let target = {}; 

  if( !userID || user._id.toString()  === userID ){
    target = user;
  }else{
    target = await  userModel.findById(userID).lean();
  }
 
  const filteredUser = {
    id:target._id,
    email:target.email,
    name:target.name ?? null,
    username:target.username ?? null,
    phone_no:target.phone_no ?? null,
    interest:target.interest ?? [],
    role:target.role,
    verified:target.verified,
    profilePicture:target.profilePicture,
    authProvider:target.authProvider,
    profileCompleted:target.profileCompleted,

    createdAt:target.createdAt,
  };

  return res.status(200).json({
    status: "success",
    message:"user information fetched successfully.",
    data: filteredUser,
  });
});

export default getUserInfo;
