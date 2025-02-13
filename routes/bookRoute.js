import express from "express";
import authorize from "../controllers/authorization.js";
import postBook from "../controllers/book/postBooks.js";
import bookListing from "../controllers/book/bookListing.js";
import { uploadPost } from "../controllers/book/postBooks.js";
import bid from "../controllers/bidding/biddingController.js";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message:{
        status:"failed",
        message:"Too many attempts try after sometimes."
    }
})


const bookRouter = express.Router();

bookRouter.post("/post",uploadPost.array("files",5),authorize,postBook);
bookRouter.get("/",authorize,bookListing);

bookRouter.post("/bid/:bidID",limiter,authorize,bid);




export default bookRouter;