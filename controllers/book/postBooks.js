import bookModel from "../../models/bookModel.js";
import handleAsync from "./../../utils/asyncFunctionHandler.js";


//! function is unfinished 
//! reason : need to accept the photos from the user and store it in some cloud storage and use multer and map the stored photo url to database

//~ method for handling the post route 
const postBook = handleAsync(async (req, res) => {

  //^ data to be posted by the user 
  const data = req.body;

  //^ daocument creation
  const uploadedData = await bookModel.create({
    ...data,
    postedBy: req.user._id,
  });

  //^ if data validated by mongoose now the book is ready to get selled and send the success response
  res.status(201).send({
    status: "success",
    message: "Book has posted for selling.",
    data : uploadedData
  });
});

export default postBook;
