/**
 * Class for SCB create QR code payload
 * @author orbitalno11 2021 A.D.
 */
class ScbQrCodePayload {
    qrType: string = "PP"
    amount: number
    ppId: string
    ppType: string
    ref1: string
    ref2: string
    ref3: string = "SCB"

    toJson(): string {
        return JSON.stringify(this)
    }
}

export default ScbQrCodePayload