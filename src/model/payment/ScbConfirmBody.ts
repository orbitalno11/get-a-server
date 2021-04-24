class ScbConfirmBody {
    payeeProxyId: string
    payeeProxyType: string
    payeeAccountNumber: string
    payeeName: string
    payerProxyId: string
    payerProxyType: string
    payerAccountNumber: string
    payerName: string
    sendingBankCode: string
    receivingBankCode: string
    amount: string
    channelCode: string
    transactionId: string
    transactionDateandTime: string
    billPaymentRef1: string
    billPaymentRef2: string
    billPaymentRef3: string
    currencyCode: string
    transactionType: string
}

export default ScbConfirmBody