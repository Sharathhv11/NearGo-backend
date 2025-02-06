import dotenv from "dotenv";
import connectDB from "./configure/mongoDB.js"
dotenv.config({
    path:"./config.env"
});
import app from "./app.js"

const PORT = process.env.PORT || 5050;

//data base connection call
connectDB();

app.get("/",(req,res) => {
    res.send("hello bhai");
})

app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
})
