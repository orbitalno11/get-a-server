import * as multer from "multer"
import FileError from "../../core/exceptions/constants/file-error.enum"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import { FileMime } from "../../core/constant/FileType"
import { ImageSize } from "../../core/constant/ImageSize.enum"
import { diskStorage } from "multer"

export class UploadFileUtils {
    private readonly allowedImageMime = [FileMime.JPEG, FileMime.PNG, FileMime.WEBP]
    private readonly allowedVideoMime = [FileMime.MP4]

    private imageFilter(req, file, cb) {
        if (this.allowedImageMime.includes(file.mimetype)) {
            return cb(null, true)
        } else {
            const error = ErrorExceptions.create(
                "Only .png, .jpg and .jpeg format allowed!",
                FileError.NOT_ALLOW
            )
            return cb(error, false)
        }
    }

    private videoFiller(req, file, cb) {
        if (this.allowedVideoMime.includes(file.mimetype)) {
            return cb(null, true)
        } else {
            const error = ErrorExceptions.create(
                "Only .mp4 format allowed!",
                FileError.NOT_ALLOW
            )
            return cb(error, false)
        }
    }

    uploadImage2MbProperty() {
        return {
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 2 * 1024 * 1024
            },
            fileFilter: (req, file, cb) => this.imageFilter(req, file, cb)
        }
    }

    uploadImage() {
        return {
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 2 * 1280 * 720
            },
            fileFilter: (req, file, cb) => this.imageFilter(req, file, cb)
        }
    }

    uploadImageA4Vertical() {
        return {
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 2 * ImageSize.A4_WIDTH_VERTICAL_PX * ImageSize.A4_HEIGHT_VERTICAL_PX
            },
            fileFilter: (req, file, cb) => this.imageFilter(req, file, cb)
        }
    }

    uploadHdVideo() {
        return {
            storage: diskStorage({
                destination: "./temp"
            }),
            limits: {
                fileSize: 1024 * ImageSize.HD_WIDTH_HORIZONTAL * ImageSize.HD_HEIGHT_HORIZONTAL
            },
            fileFilter: (req, file, cb) => this.videoFiller(req, file, cb)
        }
    }
}