import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import CustomError from "../../utils/customError.js";
import bidModel from "../../models/biddingSchema.js";
const bid = handelAsyncFunction(async (req, res, next) => {
    const { bidAmount, message } = req.body;
    const { bidID } = req.params;

    if (!bidAmount || !bidID)
        return next(new CustomError(400, "Please provide both bidAmount and bidID for placing a bid."));

    if (bidAmount <= 0 || isNaN(bidAmount))
        return next(new CustomError(400, "Invalid bid amount. Please enter a valid number."));

    //^ Fetch the bidding document along with the associated book
    const biddingData = await bidModel.findById(bidID).populate("book");

    if (!biddingData)
        return next(new CustomError(400, `No book is in the auction with id ${bidID}.`));

    //^ Prevent book owners from bidding
    if (biddingData.book.postedBy.toString() === req.user._id.toString())
        return next(new CustomError(403, "You cannot bid on your own book."));

    //^ Ensure bid amount is higher than the current bid price
    // if (bidAmount <= biddingData.currentBiddingPrice)
    //     return next(new CustomError(400, `Your bid must be higher than the current bid of ₹${biddingData.currentBiddingPrice}.`));

    //^ Update the bid with the user's amount (without forcing increments)
    const updatedBid = await bidModel.findOneAndUpdate(
        { _id: bidID },
        {
            $set: { currentBiddingPrice: bidAmount },  //^ Update highest bid
            $push: { bidders: { user: req.user._id, bid: bidAmount, message } } //^ Add to bidders array
        },
        { new: true }
    ).populate("book");

    res.status(201).send({
        status: "success",
        message: "Bid placed successfully",
        data: updatedBid
    });
});

export default bid;
