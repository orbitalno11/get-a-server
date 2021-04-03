import { HttpStatus, Injectable } from '@nestjs/common';
import { logger } from '../../../core/logging/Logger';
import FailureResponse from '../../../core/response/FailureResponse';
import TokenManager from '../../../utils/token/TokenManager';
import UserManager from '../../../utils/UserManager';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly tokenManager: TokenManager,
    private readonly userManager: UserManager,
  ) {}

  async getToken(token: string): Promise<string> {
    try {
      const validToken = await this.tokenManager.verifyFirebaseToken(token);
      if (!validToken) {
        throw FailureResponse.create(
          'Yout token is invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const firebaseUser = await this.tokenManager.decodeFirebaseToken(token);
      const userData = await this.userManager.getUser(firebaseUser.uid);

      if (!userData) {
        logger.error('Can not find user from token');
        throw FailureResponse.create(
          'Can not find user from token',
          HttpStatus.NOT_FOUND,
        );
      }
      if (!userData.id) {
        logger.error('Can not find user id');
        throw FailureResponse.create(
          'Can not find user id',
          HttpStatus.NOT_FOUND,
        );
      }

      const generateToken = this.tokenManager.generateToken(userData);
      return generateToken;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}
