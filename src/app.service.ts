import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '[DEVELOPMENT] GET-A SERVER !!';
  }
}
