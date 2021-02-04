import { Request, Response } from "express"
import multer from "multer"
import fs from "fs"
import util from "util"
import { isSafeNotNull } from "../../core/extension/StringExtension"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import { logger } from "../../utils/log/logger"
import ImageType from "../../core/ImageType"

class UploadImageMiddleware {

    private fileFilter(req:Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            cb(null, false)
            return cb(new ErrorExceptions("Only .png, .jpg and .jpeg format allowed!", FileErrorType.FILE_NOT_ALLOW))
        } else {
            return cb(null, true)
        }
    }

    private getFileDestination(dest: string): string {
        let location = "uploads/img/"
        if (isSafeNotNull(dest)) {
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
            throw new ErrorExceptions("Directory can not be created", FileErrorType.CAN_NOT_CREATE_DIRECTORY)
        }

        return location
    }

    private generateFileName(dest: string, file: Express.Multer.File): string {
        if (isSafeNotNull(dest)) {
            return dest + "-" + Date.now().toString() + this.getImageType(file)
        }
        return "common" + "-" + Date.now().toString() + this.getImageType(file)
    }

    private getImageType(file: Express.Multer.File): string | null {
        const mimetype = file.mimetype
        switch (mimetype) {
            case ImageType.JPEG_MIMETYPE: return ImageType.JPG_EXT
            case ImageType.PNG_MIMETYPE: return ImageType.PNG_EXT
            default: return null
        }
    }

    public uploadImage2Mb(dest: string = "") {
        const uploadImage2MbConfig = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    const destination = this.getFileDestination(dest)
                    cb(null, destination)
                },
                filename: (req, file, cb) => {
                    cb(null, this.generateFileName(dest, file))
                }
            }),
            limits: {
                fileSize: 2 * 1024 * 1024
            },
            fileFilter: this.fileFilter
        }).single("image")

        return uploadImage2MbConfig
    }
}

export default UploadImageMiddleware