import { Injectable } from "@nestjs/common"
import ClipRepository from "../../../repository/ClipRepository"

/**
 * Service class for "v1/clip" controller
 * @see ClipController
 * @author orbitalno11 2021 A.D.
 */
@Injectable()
export class ClipService {
    constructor(private readonly repository: ClipRepository) {
    }
}