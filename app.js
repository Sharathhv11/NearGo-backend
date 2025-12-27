import express from "express";
import userRoute from "./routes/userRoute.js"
import globalErrorHandler from "./controllers/Error/globalErrorhandler.js";
import CustomError from "./utils/customError.js";
import businessRouter from "./routes/businessRoute.js";
import userProfileRoute from "./routes/userProfileRoutes.js";
import cors from "cors";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);




app.options("*", cors());




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

//^this route is used to wake up the render server
app.get("/health",(req,res)=>{
  res.status(200).json({status:"success",message:"Server is up and running"})
})

//^ 404 route middleware
app.use("*",(req,res,next)=>{
    next(new CustomError(404,`${req.baseUrl} not found in our server.`))
})

//^global error handler
app.use(globalErrorHandler);


export default app;

