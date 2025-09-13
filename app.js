import express from "express";
import userRoute from "./routes/userRoute.js"
import relationshipRouter from "./routes/relationshipRoute.js";
import globalErrorHandler from "./controllers/Error/globalErrorhandler.js";
import CustomError from "./utils/customError.js";
import messageRoute from "./routes/messageRoute.js";

const app = express();




//^middleware for the post body data
app.use(express.json())

//^ router that manages the authentication functionality
app.use("/api/auth",userRoute);

app.use("/api/relationships",relationshipRouter);


app.use("/api/messages",messageRoute);

//^ middleware for serving the static files
// app.use(express.static("public"));


//^ 404 route middleware
app.use("*",(req,res,next)=>{
    next(new CustomError(404,`${req.baseUrl} not found in our server.`))
})

//^global error handler
app.use(globalErrorHandler);


export default app;

