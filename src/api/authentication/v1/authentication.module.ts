import { Module } from '@nestjs/common';
import { CoreModule } from '../../../core/core.module';
import { UtilityModule } from '../../../utils/utility.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [CoreModule, UtilityModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
