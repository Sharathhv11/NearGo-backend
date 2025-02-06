import express from "express";
import userRoute from "./routes/user/userRoute.js"
import globalErrorHandler from "./controllers/Error/globalErrorhandler.js";
const app = express();




//^middleware for the post body data
app.use(express.json())

//^ router that manages the authentication functionality
app.use("/api/auth",userRoute);

//^ middleware for serving the static files
// app.use(express.static("public"));



//^global error handler
app.use(globalErrorHandler);


export default app;

