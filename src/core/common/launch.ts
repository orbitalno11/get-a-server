import { logger } from "../logging/Logger"

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
        throw error
    }
}

/**
 * Wrapper function for using analytic
 * @author oribtalno11 2021 A.D.
 * @param fx
 */
export const launchAnalytic = <T>(fx: () => T): void => {
    try {
        fx()
    } catch (error) {
        logger.error(error)
    }
}