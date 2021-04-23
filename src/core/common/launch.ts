import {logger} from "../logging/Logger"
import ErrorExceptions from "../exceptions/ErrorExceptions"
import FailureResponse from "../response/FailureResponse"
import ErrorType from "../exceptions/model/ErrorType"

/**
 * Wrapper function for try catch
 * @author oribtalno11 2021 A.D.
 * @param fx
 */
export const launch = <T>(fx: () => T): T => {
    try {
        return fx()
    } catch (error) {
        logger.error(error)
        if (error instanceof ErrorExceptions || FailureResponse) throw error
        throw ErrorExceptions.create("Unexpected Error", ErrorType.UNEXPECTED_ERROR)
    }
}