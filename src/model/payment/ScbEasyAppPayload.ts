/**
 * Class for SCB Easy app request deeplink payload
 * @author oribyalno11 2021 A.D.
 */
class ScbEasyAppPayload {
    transactionType: string = "PURCHASE"
    transactionSubType: string[] = ["BP", "CCFA"]
    sessionValidityPeriod: number = 900
    billPayment: {
        paymentAmount: number,
        accountTo: string,
        ref1: string,
        ref2: string,
        ref3: string
    }
    creditCardFullAmount: {
        merchantId: string,
        terminalId: string,
        orderReference: string,
        paymentAmount: number
    }
    merchantMetaData: {
        callbackUrl: string,
        merchantInfo: {
            name: string
        }
    }

    toJson(): string {
        return JSON.stringify(this)
    }
}

export default ScbEasyAppPayload