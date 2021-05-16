import * as sharp from "sharp"
import { logger } from "../../core/logging/Logger"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ImageUtils {
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
