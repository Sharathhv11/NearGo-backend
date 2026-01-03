import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";

const getUserInfo = handelAsyncFunction(async (req, res, next) => {
  const user = req.user;

  const filteredUser = {
    id: user._id,
    email: user.email,
    name: user.name ?? null,
    username: user.username ?? null,
    phone_no: user.phone_no ?? null,
    interest: user.interest ?? [],
    role: user.role,
    verified: user.verified,
    profilePicture: user.profilePicture,
    authProvider: user.authProvider,
    profileCompleted: user.profileCompleted,

    createdAt: user.createdAt,
  };

  return res.status(200).json({
    status: "success",
    data: filteredUser,
  });
});

export default getUserInfo;
