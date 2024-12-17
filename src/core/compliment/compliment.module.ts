import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { InfrastractureModule } from './infrastracture/infrastracture.module';

@Module({
  imports: [ApplicationModule, InfrastractureModule]
})
export class ComplimentModule {}
