import handleAsync from "./../../utils/asyncFunctionHandler.js";
import oauth2client from "../../configure/googleConfig.js";
import CustomError from "./../../utils/customError.js";
import axios from "axios";
import User from "../../models/userModel.js";
import { getJWT } from "../../service/JWT.js";

const googleSignIn = handleAsync(async (req, res, next) => {
  const { code } = req.body;

  if (!code) {
    return next(new CustomError(400, "OAuth code is required"));
  }

  //^ Exchange code
  const { tokens } = await oauth2client.getToken(code);
  oauth2client.setCredentials(tokens);

  // ^ Get Google user
  const userRes = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  const { email, name, picture } = userRes.data;
  if (!email) {
    return next(new CustomError(400, "Google email not found"));
  }

  let user = await User.findOne({ email });

  // ^ CASE A: User does NOT exist → create
  if (!user) {
    user = await User.create({
      email,
      name,
      username: email, // temporary
      profilePicture: picture,
      authProvider: "google",
      profileCompleted: false,
      password: null,
      verified: true,
    });
  }

  // ^ CASE B: User exists but NOT verified (local signup)
  else if (!user.verified) {
    user.verified = true;
    user.authProvider = "google";
    user.password = null;
    user.tokenExpires = null;
    user.passwordChangedAt = null;
    user.profilePicture = picture;
    await user.save();
  }

  // ^ CASE C: User exists & verified → just login

  const token = getJWT({
    id: user._id,
    email: user.email,
    username: user.username,
  });

  res.status(200).json({
    status: "success",
    message: "Successfully authenticated with Google",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        profileCompleted: user.profileCompleted,
      },
      token,
    },
  });
});

export default googleSignIn;
