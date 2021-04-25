/**
 * Class for SCB get payment response
 * @author orbitalno11 2021 A.D.
 */
class ScbPaymentResponse {
    status: {
        code: number,
        description: string
    }
    data: {
        qrRawData: string,
        qrImage: string,
        transactionId: string,
        deeplinkUrl: string,
        userRefId: string
    }
}

export default ScbPaymentResponse