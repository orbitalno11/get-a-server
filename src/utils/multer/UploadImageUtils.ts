import * as multer from "multer"
import * as fs from "fs"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import ImageType from "../../core/constant/ImageType"

class UploadImageUtils {
  private getFileDestination(dest: string): string {
    let location = "uploads/img/"
    if (dest.isSafeNotNull()) {
      location += dest
    }

    let stat = null

    try {
      stat = fs.statSync(location)
    } catch (err) {
      fs.mkdirSync(location, {
        recursive: true
      })
    }

    if (stat && !stat.isDirectory()) {
      throw new ErrorExceptions(
        "Directory can not be created",
        FileErrorType.CAN_NOT_CREATE_DIRECTORY
      )
    }

    return location
  }

  private generateFileName(dest: string, file: Express.Multer.File): string {
    if (dest.isSafeNotNull()) {
      return dest + "-" + Date.now().toString() + this.getImageType(file)
    }
    return "common" + "-" + Date.now().toString() + this.getImageType(file)
  }

  private getImageType(file: Express.Multer.File): string | null {
    const mimetype = file.mimetype
    switch (mimetype) {
      case ImageType.JPEG_MIMETYPE:
        return ImageType.JPG_EXT
      case ImageType.PNG_MIMETYPE:
        return ImageType.PNG_EXT
      default:
        return null
    }
  }

  public uploadImage2MbProperty(dest = "") {
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
              FileErrorType.FILE_NOT_ALLOW,
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
