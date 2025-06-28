import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
    //destination: Sets the folder where files will be stored temporarily — here it’s ./public/temp
    //this is the destination that will be used in callback
  
  },
  filename: function (req, file, cb) {
    //filename: Uses the original file name for saving the file
    cb(null, file.originalname)
    //callback
  },

})
export const upload = multer(
    { 
        storage
     }
)