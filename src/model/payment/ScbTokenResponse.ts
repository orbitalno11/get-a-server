/**
 * Class for SCB get auth token response
 * @author orbitalno11 2021 A.D.
 */
class ScbTokenResponse {
    status: {
        code: number,
        description: string
    }
    data: {
        accessToken: string,
        tokenType: string,
        expiresIn: number,
        expiresAt: number,
        refreshToken: string,
        refreshExpiresIn: number,
        refreshExpiresAt:number
    }
}

export default ScbTokenResponse