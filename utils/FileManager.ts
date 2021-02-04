import fs from "fs"
import sharp from "sharp"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import FileErrorType from "../core/exceptions/model/FileErrorType"
import ImageType from "../core/ImageType"
import { logger } from "./log/logger"

class FileManager {
    public deleteFile(path: string) {
        try {
            fs.unlinkSync(path)
        } catch (err) {
            logger.error(err)
            throw new ErrorExceptions("Cannot delete file", FileErrorType.CANNOT_DELETE_FILE)
        }
    }

    public async convertImageToProfile(filePath: string, userId: string): Promise<string> {
        try {
            const convertImagePath =  await this.convertImageToWebp(filePath, 300, 300)
            const fileLocation = filePath.split("-")[0] + "-" + userId + ImageType.WEBP_EXT
            await this.renameFile(convertImagePath, fileLocation)
            return convertImagePath
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot create profile picture", FileErrorType.CANNOT_CONVERT_PROFILE_IMAGE)
        }
    }

    private async renameFile(oldFilePath: string, newFilePath: string): Promise<void> {
        try {
            fs.renameSync(oldFilePath, newFilePath)
        } catch (error) {
            logger.error(error)
            throw new ErrorExceptions("Cannot rename file", FileErrorType.CANNOT_RENAME_FILE)
        }
    }

    private async convertImageToWebp(filePath: string, width: number, height: number): Promise<string> {
        try {
            const image = sharp(filePath)
            const newFilePath = filePath.split(".")[0] + ".webp"
            await image.resize({
                width: width,
                height: height,
                fit: "cover"
            })
                .toFormat("webp")
                .toFile(newFilePath)
            this.deleteFile(filePath)
            return newFilePath
        } catch (err) {
            logger.error(err)
            if (err instanceof ErrorExceptions) {
                if (err["type"] == FileErrorType.CANNOT_DELETE_FILE) {
                    throw new ErrorExceptions("Cannot delete original image", FileErrorType.CANNOT_DELETE_FILE)
                }
            }
            throw new ErrorExceptions("Cannot convert image to wepb", FileErrorType.CANNOT_CONVERT_FILE_TO_WEBP)
        }
    }
}

export default FileManager