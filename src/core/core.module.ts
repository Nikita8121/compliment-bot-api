import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ComplimentModule } from './compliment/compliment.module';

@Module({
  imports: [UserModule, ComplimentModule]
})
export class CoreModule {}
