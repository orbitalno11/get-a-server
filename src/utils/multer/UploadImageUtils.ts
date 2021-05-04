import * as multer from "multer"

class UploadImageUtils {
    public uploadImage2MbProperty() {
        return {
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 2 * 1024 * 1024
            },
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
                    /* TODO try to return specific error
                      const error = ErrorExceptions.create(
                        'Only .png, .jpg and .jpeg format allowed!',
                        FileError.FILE_NOT_ALLOW,
                      );
                    */
                    return cb(null, false)
                } else {
                    return cb(null, true)
                }
            }
        }
    }
}

export default UploadImageUtils
