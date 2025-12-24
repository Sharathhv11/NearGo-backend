import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";

const getUserInfo = handelAsyncFunction(async (req, res, next) => {
    
  const user = req.user;

  
  const filteredUser = {
    id: user._id,
    email: user.email,
    username: user.username ?? null,
    name: user.name ?? null,
    phone_no: user.phone_no ?? null,
    interest: user.interest,
    role: user.role,
    verified: user.verified,
    profilePicture: user.profilePicture,
    createdAt: user.createdAt,
  };

  return res.status(200).json({
    status: "success",
    data: filteredUser,
  });
});

export default getUserInfo;
