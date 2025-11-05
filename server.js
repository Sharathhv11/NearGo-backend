import "dotenv/config"
import connectDB from "./configure/mongoDB.js"
import app from "./app.js"

const PORT = 5050 ;



//data base connection call
connectDB();



app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
})
