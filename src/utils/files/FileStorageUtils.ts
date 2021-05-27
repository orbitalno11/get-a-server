import * as aws from "aws-sdk"
import * as fs from "fs"
import {
    AWS_ACCESS_KEY_ID,
    AWS_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
    DIGITAL_OCEAN_SPACE_CDN_ENDPOINT,
    DIGITAL_OCEAN_SPACE_ENDPOINT
} from "../../configs/EnvironmentConfig"
import { FileExtension, FileMime } from "../../core/constant/FileType"
import ErrorExceptions from "../../core/exceptions/ErrorExceptions"
import FileError from "../../core/exceptions/constants/file-error.enum"
import { logger } from "../../core/logging/Logger"
import { Injectable } from "@nestjs/common"
import { ImageUtils } from "./ImageUtils"
import FileProperty from "../../model/common/FileProperty"
import UploadedFileProperty from "../../model/common/UploadedFileProperty"

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
     * @param identityName
     * @param folderName
     * @param width
     * @param height
     */
    async uploadImageTo(
        file: Express.Multer.File,
        identityName: string,
        folderName: string,
        width: number | null = 200,
        height: number | null = 200
    ): Promise<string> {
        const property = this.getFileProperty(file, identityName, folderName, FileExtension.WEBP)
        const imageBuffer = await ImageUtils.convertImageToWebP(file, width, height)
        const uploadedFile = await this.uploadFile(imageBuffer, property.filePath, property.contentType)
        return uploadedFile.url
    }

    /**
     * Upload any file to storage
     * @param file
     * @param identityName
     * @param folderName
     * @param fileType
     */
    async uploadFileTo(file: Express.Multer.File, identityName: string, folderName: string, fileType?: string): Promise<string> {
        const property = this.getFileProperty(file, identityName, folderName, fileType)
        const uploadedFile = await this.uploadFile(file.buffer, property.filePath, property.contentType)
        return uploadedFile.url
    }

    /**
     * Upload .mp4 file to cloud storage
     * @param file
     * @param identityName
     * @param folderName
     */
    async uploadVideoFromLocalStorageTo(
        file: Express.Multer.File,
        identityName: string,
        folderName: string
    ): Promise<UploadedFileProperty> {
        const property = this.getFileProperty(file, identityName, folderName, FileExtension.MP4)
        return await this.uploadFileFromLocalStorage(file.path, property.filePath, property.contentType)
    }

    /**
     * Upload any file from local storage to cloud storage
     * @param localPath
     * @param cloudPath
     * @param contentType
     */
    private async uploadFileFromLocalStorage(
        localPath: string,
        cloudPath: string,
        contentType: string
    ): Promise<UploadedFileProperty> {
        try {
            const fileBuffer = fs.readFileSync(localPath)
            const uploadedFile = await this.uploadFile(fileBuffer, cloudPath, contentType)
            fs.unlinkSync(localPath)
            return uploadedFile
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not upload file to storage", FileError.CAN_NOT_UPLOAD_TO_STORAGE)
        }
    }

    /**
     * Upload file function
     * @param file
     * @param filePath
     * @param contentType
     * @private
     */
    private async uploadFile(file: Buffer, filePath: string, contentType: string): Promise<UploadedFileProperty> {
        try {
            const uploadedFile = await this.s3.upload({
                Bucket: AWS_BUCKET_NAME,
                Key: filePath,
                ACL: "public-read",
                ContentType: contentType,
                Body: file
            }).promise()
            return {
                url: uploadedFile.Location,
                path: uploadedFile.Key
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not upload file to storage", FileError.CAN_NOT_UPLOAD_TO_STORAGE)
        }
    }

    /**
     * Delete file
     * @param param
     */
    async deleteFile(param: string) {
        if (param.includes(DIGITAL_OCEAN_SPACE_ENDPOINT) || param.includes(DIGITAL_OCEAN_SPACE_CDN_ENDPOINT)) {
            await this.deleteFileFromUrl(param)
        } else {
            await this.deleteFileFromPath(param)
        }
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
     * Delete file from file path
     * @param path
     */
    async deleteFileFromPath(path: string) {
        try {
            if (path?.isSafeNotBlank()) {
                await this.s3.deleteObject({
                    Bucket: AWS_BUCKET_NAME,
                    Key: path
                }).promise()
            }
        } catch (error) {
            logger.error(error)
            throw ErrorExceptions.create("Can not delete file from storage", FileError.CAN_NOT_DELETE)
        }
    }

    /**
     * Get file property to upload
     * @param file
     * @param identityName
     * @param folderName
     * @param fileType
     * @private
     */
    private getFileProperty(file: Express.Multer.File, identityName: string, folderName: string, fileType?: string): FileProperty {
        const fileExt = fileType ? fileType : this.getFileExtension(file)
        const _folderName = folderName.includes("/") ? folderName.replace("/", "-") : folderName
        if (fileExt.isBlank()) {
            throw ErrorExceptions.create("File type is invalid", FileError.NOT_ALLOW)
        }
        const contentType = this.getFileMime(fileExt)
        if (contentType.isBlank()) {
            throw ErrorExceptions.create("File type is invalid", FileError.NOT_ALLOW)
        }
        const fileName = this.getFileName(_folderName, fileExt)
        const filePath = `${identityName}/${folderName}/${fileName}`
        return {
            fileName: fileName,
            filePath: filePath,
            fileExt: fileExt,
            contentType: contentType
        }
    }

    /**
     * Get custom file name
     * @param identity
     * @param fileType
     * @private
     */
    private getFileName(identity: string, fileType: string): string {
        return identity + "-" + Date.now().toString() + fileType
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
            case FileExtension.MP4:
                return FileMime.MP4
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
        if (url.includes(DIGITAL_OCEAN_SPACE_ENDPOINT)) {
            return url.split(DIGITAL_OCEAN_SPACE_ENDPOINT + "/")[1]
        } else {
            return url.split(DIGITAL_OCEAN_SPACE_CDN_ENDPOINT + "/")[1]
        }
    }
}