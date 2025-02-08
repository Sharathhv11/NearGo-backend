import express from "express";
import authorize from "../controllers/authorization.js";
import postBook from "../controllers/book/postBooks.js";
import bookListing from "../controllers/book/bookListing.js";


const bookRouter = express.Router();

bookRouter.post("/post",authorize,postBook);
bookRouter.get("/",authorize,bookListing);


export default bookRouter;