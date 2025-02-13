import bookModel from "../../models/bookModel.js";
import bidModel from "./../../models/biddingSchema.js"
//! models related  books

import handleAsync from "./../../utils/asyncFunctionHandler.js";
import getClient from "../../configure/supabase.js";
import multer from "multer";
import CustomError from "../../utils/customError.js";

const storage = multer.memoryStorage();
const uploadPost = multer({ storage: storage });




//~ method for handling the post route
const postBook = handleAsync(async (req, res, next) => {
  let data = req.body;

  if( !data?.for ){
    return next(new CustomError(400,"Please provide the for feild."));
  }

  const bookData = await bookModel.create(
    {
    ...data,
    postedBy: req.user._id
  }
  );

  let bidDoc = null;
  if( data.for === "bidding" ){
    bidDoc = await bidModel.create({
      book : bookData._id
    })
  }
     


  //^ Upload files in parallel

  // const filesUrl = await Promise.all(
  //   req.files.map(async (file) => {
  //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //     const filePath = `${uniqueSuffix}-${file.originalname}`;
  
  //     const { data: fileData, error } = await getClient().storage
  //       .from("ReBooK")
  //       .upload(filePath, file.buffer, { cacheControl: "3600", upsert: false });
  
  //     if (error || !fileData) {
  //       console.error("Upload Error:", error);
  //       return null; // Skip failed uploads
  //     }
  
  //     // ✅ Correct way to get the public URL
  //     const publicUrl = getClient().storage.from("ReBooK").getPublicUrl(filePath).publicUrl;
  
  //     console.log("File Uploaded:", publicUrl); // Debugging
  
  //     return publicUrl;
  //   })
  // );
  
   

   
  // ^ Remove any null values (failed uploads)
  // uploadedData.coverImage = filesUrl;
  // uploadedData =  await uploadedData.save();

  res.status(201).send({
    status: "success",
    message: "Book has been posted for selling.",
    data: bookData,
  });
});


export default postBook;
export { uploadPost };
