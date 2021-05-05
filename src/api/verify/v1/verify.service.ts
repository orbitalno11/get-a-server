import { Injectable } from "@nestjs/common"
import VerifyRepository from "../../../repository/VerifyRepository"
import { launch } from "../../../core/common/launch"

/**
 * Service class for "v1/verify"
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class VerifyService {
    constructor(private readonly repository: VerifyRepository) {
    }

    /**
     * Approved education verification
     * @param requestId
     */
    approvedEducation(requestId: string) {
        return launch(async () => {
            await this.repository.approvedEducation(requestId)
        })
    }

    /**
     * Denied education verification
     * @param requestId
     */
    deniedEducation(requestId: string) {
        return launch(async () => {
            await this.repository.deniedEducation(requestId)
        })
    }
}