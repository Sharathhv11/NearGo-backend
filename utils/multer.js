import multer from "multer";
import CustomError from "./customError.js";

const storage = multer.memoryStorage();

const upload = multer({
      storage,
      limits: {
        fileSize: 1024 * 1024 * 10,
      },
      fileFilter: function (req, file, cb) {
        const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else
          cb(new CustomError(400, "Only image and mp4 formats are allowed."));
      },
    });

export default upload;
