class ScbQrCodeResponse {
    status: {
        code: number,
        description: string
    }
    data: {
        qrRawData: string,
        qrImage: string
    }
}

export default ScbQrCodeResponse