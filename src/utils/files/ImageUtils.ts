import ImageType from "../../core/constant/ImageType"
import * as sharp from "sharp"
import { logger } from "../../core/logging/Logger"

export class ImageUtils {
  public static getImageType(file: Express.Multer.File): string {
    const mimetype = file.mimetype
    switch (mimetype) {
      case ImageType.JPEG_MIMETYPE:
        return ImageType.JPG_EXT
      case ImageType.PNG_MIMETYPE:
        return ImageType.PNG_EXT
      default:
        return ""
    }
  }

  public static generateImageName(dest: string, file: Express.Multer.File, fileType: string | null = ImageType.WEBP_EXT): string {
    if (dest.isSafeNotNull()) {
      return dest + "-" + Date.now().toString() + fileType
    } else {
      return "common-" + Date.now().toString() + fileType
    }
  }

  public static async convertImageToWebP(file: Express.Multer.File, width: number, height: number): Promise<Buffer | null> {
    try {
      const image = sharp(file.buffer)
      return await image
        .resize({
          width: width,
          height: height,
          fit: "cover"
        })
        .toFormat("webp")
        .toBuffer()
    } catch (error) {
      logger.error(error)
      return null
    }
  }
}
