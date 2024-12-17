import { Module } from '@nestjs/common';
import { REPOSITORIES } from './repositories';
import { MAPPERS } from './mappers';

@Module({
  providers: [...REPOSITORIES, ...MAPPERS],
  exports: [...REPOSITORIES],
})
export class InfrastractureModule {}
