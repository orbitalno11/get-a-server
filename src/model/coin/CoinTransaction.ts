import { CoinTransactionType } from "./data/CoinTransaction.enum"
import { CoinTransactionEntity } from "../../entity/coins/CoinTransaction.entity"

/**
 * Model Class for coin transaction
 * @author orbitalno11 2021 A.D.
 */
class CoinTransaction {
    transactionId: string
    transactionType: CoinTransactionType
    numberOfCoin: number
    transactionDate: Date

    // static method
    public static createFormEntity(entity: CoinTransactionEntity): CoinTransaction {
        const transaction = new CoinTransaction()
        transaction.transactionId = entity.transactionId
        transaction.transactionType = entity.transactionType
        transaction.numberOfCoin = entity.numberOfCoin
        transaction.transactionDate = entity.transactionDate
        return transaction
    }
}

export default CoinTransaction