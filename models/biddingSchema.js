import mongoose from "mongoose"


const Bidders = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    bid : {
        type : Number,
        required : true
    },
    message : {
        type : String
    }
},{
    timestamps:true
});

const biddingSchemma = new mongoose.Schema({
    book : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Books",
        required:true
    },
    currentBiddingPrice : {
        type : Number,
        default : 0
    },
    bidders : [Bidders]
},{
    timestamps:true
});



const bidModel = mongoose.model("Bidding",biddingSchemma);

export default bidModel;