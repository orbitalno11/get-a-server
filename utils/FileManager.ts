import fs from "fs"
import ErrorExceptions from "../core/exceptions/ErrorExceptions"
import FileErrorType from "../core/exceptions/model/FileErrorType"
import { logger } from "./log/logger"

class FileManager {
    public static deleteFile(path: string) {
        try {
            fs.unlinkSync(path)
        } catch (err) {
            logger.error(err)
            throw new ErrorExceptions("Cannot delete file", FileErrorType.CANNOT_DELETE_FILE)
        }
    }
}

export default FileManager