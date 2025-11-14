import express from "express";
import userRoute from "./routes/userRoute.js"
import globalErrorHandler from "./controllers/Error/globalErrorhandler.js";
import CustomError from "./utils/customError.js";
import businessRouter from "./routes/businessRoute.js";
import userProfileRoute from "./routes/userProfileRoutes.js";

const app = express();




//^middleware for the post body data
app.use(express.json())

//^ router that manages the authentication functionality
app.use("/api/auth",userRoute);


//^ router that manages the business logic 
app.use("/api/business",businessRouter);

//^ router that manages the user Profile 
app.use("/api/user",userProfileRoute);

//^ middleware for serving the static files
// app.use(express.static("public"));


//^ 404 route middleware
app.use("*",(req,res,next)=>{
    next(new CustomError(404,`${req.baseUrl} not found in our server.`))
})

//^global error handler
app.use(globalErrorHandler);


export default app;

