import express from "express";
import userRoute from "./routes/userRoute.js"
import globalErrorHandler from "./controllers/Error/globalErrorhandler.js";
import CustomError from "./utils/customError.js";
import businessRouter from "./routes/businessRoute.js";
import userProfileRoute from "./routes/userProfileRoutes.js";
import cors from "cors";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND,        // https://sharath.vercel.app
  "http://localhost:5173",     // Vite
  "http://localhost:3000",     // CRA (just in case)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());





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


//^ 404 route middleware
app.use("*",(req,res,next)=>{
    next(new CustomError(404,`${req.baseUrl} not found in our server.`))
})

//^global error handler
app.use(globalErrorHandler);


export default app;

