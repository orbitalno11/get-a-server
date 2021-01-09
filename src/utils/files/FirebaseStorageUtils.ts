import { bucket } from "../../configs/FirebaseConfig"
import { isEmpty } from "../../core/extension/CommonExtension"
import { ImageUtils } from "./ImageUtils"
import { logger } from "../../core/logging/Logger"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileErrorType from "../../core/exceptions/model/FileErrorType"
import ImageType from "../../core/constant/ImageType"

export class FirebaseStorageUtils {

  async uploadImage(
    identifyName: string,
    folderName: string,
    file: Express.Multer.File,
    width: number | null = 200,
    height: number | null = 200
  ): Promise<string> {
    try {
      if (isEmpty(file)) {
        throw ErrorExceptions.create("Can not found image", FileErrorType.FILE_NOT_FOUND)
      }

      const buffer = await ImageUtils.convertImageToWebP(file, width, height)
      const fileName = ImageUtils.generateImageName(identifyName, file, ImageType.WEBP_EXT)
      const fileUpload = bucket.file(`${folderName}/${fileName}`)

      if (buffer !== null) {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: ImageType.WEBP_MIMETYPE
          }
        })

        blobStream.on("finish", async () => {
          await fileUpload.makePublic()
        })

        blobStream.end(buffer)

        return await fileUpload.publicUrl()
      } else {
        throw ErrorExceptions.create("Can not found image for upload to storage service", FileErrorType.CAN_NOT_UPLOAD_IMAGE_TO_STORAGE)
      }
    } catch (error) {
      logger.error(error)
      if (error instanceof ErrorExceptions) throw error
      throw ErrorExceptions.create("Can not upload image to storage service", FileErrorType.CAN_NOT_UPLOAD_IMAGE_TO_STORAGE)
    }
  }

  async deleteImage(url: string | null): Promise<boolean> {
    try {
      if (url.isSafeNotNull()) {
        const filePath = this.extractImagePathFromUrl(url)
        await bucket.file(filePath).delete()
        return true
      } else {
        throw ErrorExceptions.create("Can not found delete file url", FileErrorType.CANNOT_DELETE_FILE)
      }
    } catch (error) {
      logger.error(error)
      if (error instanceof ErrorExceptions) throw error
      throw ErrorExceptions.create("Can not delete image from storage service", FileErrorType.CANNOT_DELETE_FILE)
    }
  }

  private extractImagePathFromUrl(url: string) {
    return url.split(bucket.name + "/")[1]
  }
}