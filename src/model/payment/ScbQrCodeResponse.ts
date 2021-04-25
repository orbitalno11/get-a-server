/**
 * Class for SCB QR code response
 * @author orbitalno11 2021 A.D.
 */
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