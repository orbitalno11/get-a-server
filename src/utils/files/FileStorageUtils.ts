import * as aws from "aws-sdk"
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
    DIGITAL_OCEAN_SPACE_ENDPOINT
} from "../../configs/EnvironmentConfig"
import { FileExtension, FileMime } from "../../core/constant/FileType"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileError from "../../core/exceptions/constants/file-error.enum"
import { logger } from "../../core/logging/Logger"
import { Injectable } from "@nestjs/common"
import { ImageUtils } from "./ImageUtils"

/**
 * Utility class for upload image to could storage
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class FileStorageUtils {
    private readonly spaceEndpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com")
    private readonly s3 = new aws.S3({
        endpoint: this.spaceEndpoint,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    })

    /**
     * Upload image to storage (It will convert to webp)
     * @param file
     * @param folderName
     * @param identifyName
     * @param width
     * @param height
     */
    async uploadImageTo(
        file: Express.Multer.File,
        folderName: string,
        identifyName: string,
        width: number | null = 200,
        height: number | null = 200
    ): Promise<string> {
        const property = this.getFileProperty(file, folderName, identifyName, FileExtension.WEBP)
        const imageBuffer = await ImageUtils.convertImageToWebP(file, width, height)
        return await this.uploadFile(imageBuffer, property.filePath, property.contentType)
    }

    /**
     * Upload any file to storage
     * @param file
     * @param folderName
     * @param identifyName
     * @param fileType
     */
    async uploadFileTo(file: Express.Multer.File, folderName: string, identifyName: string, fileType?: string): Promise<string> {
        const property = this.getFileProperty(file, folderName, identifyName, fileType)
        return await this.uploadFile(file.buffer, property.filePath, property.contentType)
    }

    /**
     * Upload file function
     * @param file
     * @param filePath
     * @param contentType
     * @private
     */
    private async uploadFile(file: Buffer, filePath: string, contentType: string): Promise<string> {
        this.s3.putObject({
            Bucket: AWS_BUCKET_NAME,
            Key: filePath,
            ACL: "public-read",
            ContentType: contentType,
            Body: file
        }, (error, data) => {
            if (error) {
                logger.error(error)
                throw ErrorExceptions.create("Can not upload file to storage", FileError.CAN_NOT_UPLOAD_TO_STORAGE)
            }
        })
        return `${DIGITAL_OCEAN_SPACE_ENDPOINT}/${filePath}`
    }

    /**
     * delete file form file url
     * @param url
     */
    async deleteFileFromUrl(url: string) {
        if (url?.isSafeNotBlank()) {
            const filePath = this.extractFilePathFromUrl(url)
            this.s3.deleteObject({
                Bucket: AWS_BUCKET_NAME,
                Key: filePath
            }, (error, data) => {
                if (error) {
                    logger.error(error)
                    throw ErrorExceptions.create("Can not delete file from storage", FileError.CAN_NOT_DELETE)
                }
            })
        }
    }

    /**
     * Get file property to upload
     * @param file
     * @param folderName
     * @param identifyName
     * @param fileType
     * @private
     */
    private getFileProperty(file: Express.Multer.File, folderName: string, identifyName: string, fileType?: string): FileProperty {
        const fileExt = fileType ? fileType : this.getFileExtension(file)
        if (fileExt.isBlank()) {
            throw ErrorExceptions.create("File type is invalid", FileError.NOT_ALLOW)
        }
        const contentType = this.getFileMime(fileExt)
        if (contentType.isBlank()) {
            throw ErrorExceptions.create("File type is invalid", FileError.NOT_ALLOW)
        }
        const fileName = this.getFileName(identifyName, fileExt)
        const filePath = `${folderName}/${identifyName}/${fileName}`
        return {
            fileName: fileName,
            filePath: filePath,
            fileExt: fileExt,
            contentType: contentType
        }
    }

    /**
     * Get custom file name
     * @param identify
     * @param fileType
     * @private
     */
    private getFileName(identify: string, fileType: string): string {
        return identify + "-" + Date.now().toString() + fileType
    }

    /**
     * Get accept file extension
     * @param file
     * @private
     */
    private getFileExtension(file: Express.Multer.File): string {
        const mimetype = file.mimetype
        switch (mimetype) {
            case FileMime.JPEG:
                return FileExtension.JPG
            case FileMime.PNG:
                return FileExtension.PNG
            case FileMime.PDF:
                return FileExtension.PDF
            case FileMime.WEBP:
                return FileExtension.WEBP
            case FileMime.MP4:
                return FileExtension.MP4
            default:
                return ""
        }
    }

    /**
     * Get accept file mimetype
     * @param extension
     * @private
     */
    private getFileMime(extension: string): string {
        switch (extension) {
            case FileExtension.JPG:
                return FileMime.JPEG
            case FileExtension.JPEG:
                return FileMime.JPEG
            case FileExtension.PNG:
                return FileMime.PNG
            case FileExtension.PDF:
                return FileMime.PDF
            case FileExtension.WEBP:
                return FileMime.WEBP
            default:
                return ""
        }
    }

    /**
     * extract file path from file url
     * @param url
     * @private
     */
    private extractFilePathFromUrl(url: string): string {
        return url.split(DIGITAL_OCEAN_SPACE_ENDPOINT + "/")[1]
    }
}

/**
 * Interface for file property
 * @author orbitalno11 2021 A.D.
 */
interface FileProperty {
    fileName: string
    filePath: string
    fileExt: string
    contentType: string
}