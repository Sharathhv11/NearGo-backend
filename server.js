import "dotenv/config"
import connectDB from "./configure/mongoDB.js"
import app from "./app.js"

const PORT = process.env.PORT ;



//data base connection call
connectDB();



app.listen(PORT,"0.0.0.0",() => {
    console.log(`server running on port ${PORT}`);
})
